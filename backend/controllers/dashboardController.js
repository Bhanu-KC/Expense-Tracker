const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Types } = require("mongoose");

exports.getDashboardData = async (req, res) => {
  try {
    const userID = req.user.id;
    const userObjectId = new Types.ObjectId(String(userID));


    // Total Income & Expense
    const totalIncomeAgg = await Income.aggregate([
      { $match: { userID: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpenseAgg = await Expense.aggregate([
      { $match: { userID: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalIncome = totalIncomeAgg[0]?.total || 0;
    const totalExpense = totalExpenseAgg[0]?.total || 0;

    // Last 60 Days Income
    const last60Days = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const today = new Date();

    const last60DaysIncomeTransactions = await Income.find({
      userID: userObjectId,
      createdAt: { $gte: last60Days, $lte: today },
    }).sort({ createdAt: -1 });

    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, txn) => sum + txn.amount,
      0
    );

    const last30DaysExpenseTransactions = await Expense.find({
      userID: userObjectId,
      createdAt: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        $lte: today,
      },
    }).sort({ createdAt: -1 });

    const expenseLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, txn) => sum + txn.amount,
      0
    );

    // Last 5 transactions (Income + Expense)
    const recentTransactions = [
      ...(
        await Income.find({ userID: userObjectId }).sort({ date: -1 }).limit(5)
      ).map((txn) => ({ ...txn.toObject(), type: "income" })),
      ...(
        await Expense.find({ userID: userObjectId }).sort({ date: -1 }).limit(5)
      ).map((txn) => ({ ...txn.toObject(), type: "expense" })),
    ].sort((a, b) => b.date - a.date);

    // Send final response
    res.json({
      totalBalance: totalIncome - totalExpense,
      totalIncome,
      totalExpenses: totalExpense,
      last30DaysExpenses: {
        total: expenseLast30Days,
        transactions: last30DaysExpenseTransactions,
      },
      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },
      recentTransactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

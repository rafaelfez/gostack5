import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    if (!['income', 'outcome'].includes(type)) {
      throw Error('Type of transaction is invalid');
    }

    if (Number.isNaN(Number(value))) {
      throw Error('Value of transaction is invalid');
    }

    if (type === 'outcome') {
      const getBalance = this.transactionsRepository.getBalance();

      if (getBalance.total < value) {
        throw Error('You dont have money enough');
      }
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;

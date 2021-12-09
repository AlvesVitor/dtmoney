import { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { api } from "../services";

const TransactionContext = createContext<TransactionsContextData>({} as TransactionsContextData);

interface TransactionsContextData {
    transactions: Transaction[];
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}

interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string;
}

//Omit segue por anotação de atributos a serem ignorados
type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>

//pick segue por anotação de atributos a serem copiados
// type TransactionInput = Pick<Transaction, 'title' | 'amout' | 'type' | 'category'>

interface TransactionProviderProps {
    children: ReactNode
}
export function TransactionsProvider({ children }: TransactionProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        api.get("/transactions")
            .then(response => setTransactions(response.data.transactions))

    }, [])

    async function createTransaction(transactionInput: TransactionInput) {

        const response = await api.post("/transactions", {
            ...transactionInput,

            createdAt: new Date()
        })

        const { transaction } = response.data;

        setTransactions([
            ...transactions,
            transaction
        ])
    }

    return (
        <TransactionContext.Provider
            value={{ transactions, createTransaction }}
        >
            {children}
        </TransactionContext.Provider>
    )

}

export function useTransaction() {
    const context = useContext(TransactionContext);

    return context;

}
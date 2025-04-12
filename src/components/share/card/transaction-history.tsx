import { useAuthStore } from '@/data';
import { currencyType } from '@/lib/utils';
import { PaymentHistoryEntry } from '@/types';
import dayjs from 'dayjs';
import { List } from 'lucide-react';

const TransactionHistory = ({ paymentHistory }: { paymentHistory: PaymentHistoryEntry[] }) => {

    const { user } = useAuthStore();

    return (
        <div className="">
            <h2 className="text-sm font-semibold py-2 text-[#141B34] border-b border-[#0000000a] ">Transaction History</h2>

            {paymentHistory.length ? <div className="overflow-x-auto">
                <table className="w-full">
                    <tbody>
                        {paymentHistory.map((item, index) => (
                            <tr
                                key={index}
                                className="flex justify-between items-start flex-[1_0_0]"
                            >
                                <td className="py-3.5 text-sm font-medium text-neutral-1000">{dayjs(item.created * 1000).format('MMM DD, YYYY h:mm A')}</td>
                                <td className="py-3.5 text-sm text-neutral-800">{item.status}</td>
                                <td className="py-3.5 text-sm text-neutral-800">{user?.email}</td>
                                <td className="py-3.5 text-sm text-neutral-800 text-right">{currencyType[String(item.currency).toLowerCase() as keyof typeof currencyType]}{item.amount / 100}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
                :
                <div className="flex justify-center items-center h-full mt-3">
                    <div className="text-center p-6 bg-white rounded-lg max-w-md mx-4">
                        <List className="w-10 h-10 mx-auto mb-4 text-neutral-800" />
                        <p className="text-sm text-neutral-800">No transaction history found.</p>
                    </div>
                </div>
            }

        </div>
    );
};

export default TransactionHistory;
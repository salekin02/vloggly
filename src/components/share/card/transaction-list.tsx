"use client";
import { useAuthStore } from '@/data';
import dayjs from 'dayjs';
import { currencyType } from '@/lib/utils';
import { List } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCards } from '@/hook';

const TransactionList = () => {
    const { user } = useAuthStore();
    const { paymentHistory, historyLoading } = useCards();

    return (
        <div>
            <div className="w-full h-max-[264px] overflow-y-auto py-[14px] bg-white rounded-[20px] border border-[#0000000a] flex flex-col">
                <h2 className="font-bold text-[#141B34] text-sm px-4 py-2 border-b border-[#0000000a]">Latest Transaction</h2>

                <div className="p-4 pb-0 space-y-4">
                    {historyLoading ?

                        <div className="space-y-2">
                            <Skeleton className="h-2 w-full" />
                            <Skeleton className="h-2 w-full" />
                            <Skeleton className="h-2 w-full" />
                            <Skeleton className="h-2 w-full" />
                        </div>
                        :
                        paymentHistory.length ? paymentHistory.map((item, index) => <div key={index}>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="font-medium text-sm text-[#151515]">{dayjs(item.created * 1000).format('MMM DD, YYYY h:mm A')}</span>
                                <span className="text-neutral-800 text-sm">{currencyType[String(item.currency).toLowerCase() as keyof typeof currencyType]}{item.amount / 100}</span>
                            </div>
                            <div className="text-sm text-neutral-800">Paid from {user?.email}</div>
                        </div>)
                            :
                            <div className="flex justify-center items-center h-full mt-3">
                                <div className="text-center p-6 bg-white rounded-lg max-w-md mx-4">
                                    <List className="w-10 h-10 mx-auto mb-4 text-neutral-800" />
                                    <p className="text-sm text-neutral-800">No transaction history found.</p>
                                </div>
                            </div>
                    }

                </div>
            </div>


        </div>
    );
};
export default TransactionList;
export interface PaymentDetails {
    amount: number,
    currency: string,
    creatorId: string,
    paymentType: string
}

export interface PaymentResponse {
    clientSecret?: string
}
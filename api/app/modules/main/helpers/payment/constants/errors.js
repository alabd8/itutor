import { InternalErrorStatus , LoginNotFoundStatus, 
         IncorrectAmountStatus, UnableToPerformOperationStatus,
         TransactionNotFoundStatus, OrderCompletedStatus } from ".";


export const InternalErrorCode = { code: InternalErrorStatus, message: "Internal error" };
export const LoginNotFoundCode = { code: LoginNotFoundStatus, message: "Login not found." };
export const IncorrectAmountCode =  { code: IncorrectAmountStatus, message: "Incorrect amount." };
export const UnableToPerformOperationCode = { 
    code: UnableToPerformOperationStatus, 
    message: "Unable to perform operation." 
};
export const TransactionNotFoundCode = { code: TransactionNotFoundStatus, message: "Transaction not found" };
export const OrderCompletedCode = { 
    code: OrderCompletedStatus, 
    message: `Order completed. Cannot cancel transaction. 
              The product or service is provided to the buyer in full.` 
};
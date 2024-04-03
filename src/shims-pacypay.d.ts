declare module '@/utils/pacypay' {
  export default class PacypayCheckout {
    constructor(transactionId: string, options?: object);
    static version: string;
    createCheckout(options: object, transactionId: string): void;
    submit(data?: object): void;
  }
}
import StripeProvider from "../../providers/StripeProvider";
import Checkout from "./Checkout";

export default function CheckoutPage() {
  return (
    <StripeProvider>
      <Checkout />
    </StripeProvider>
  );
}
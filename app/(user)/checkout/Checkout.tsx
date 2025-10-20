"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addData, deleteData, decreaseData, deleteCart } from "@/features/itemSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getFromStorage } from "@/lib/storage";
import { setToStorage } from "@/lib/storage";

interface FormData {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zip: string;
  shipAddress?: string;
  shipCity?: string;
  shipCountry?: string;
  shipZip?: string;
  shipadd?: boolean;
  billingMethod: string;
  paymentMethod: string;
  notes?: string;
  marketing?: boolean;
  terms: boolean;
}

const Checkout = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const router = useRouter();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const cartItems = useSelector((state: any) => state.items.list);
  const user = useSelector((state: any) => state.user.user);
  const itemQuantity = useSelector((state: any) =>
    state.items.list.reduce((acc: any, item: any) => acc + item.quantity, 0)
  );
  const itemTotal = useSelector((state: any) =>
    state.items.list.reduce((acc: any, item: any) => acc + item.price * item.quantity, 0)
  );

  const [paypal, setPaypal] = useState<boolean>(false);
  const [card, setCard] = useState<boolean>(false);
  const [bitcoin, setBitcoin] = useState<boolean>(false);
  const [fedex, setFedex] = useState<boolean>(false);
  const [dhl, setDhl] = useState<boolean>(false);
  const [difadd, setDifadd] = useState<boolean>(false);
  const [cardError, setCardError] = useState<string>("");
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [promoCode, setPromoCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  const createPayment = async (amount: number): Promise<string | undefined> => {
    try {
      const response = await axios.post<{ clientSecret: string }>(
        `${API_BASE_URL}/api/orders/create-payment-intent`,
        { amount: amount * 100 } // Convert to cents for Stripe
      );
      return response.data.clientSecret;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      toast.error("Failed to create payment intent");
      return undefined;
    }
  };

  const handleApplyPromo = () => {
    const validPromoCodes: { [key: string]: number } = {
      SAVE10: 10,
      DISCOUNT5: 5,
    };

    const code = promoCode.trim().toUpperCase();
    if (validPromoCodes[code] !== undefined) {
      setDiscount(validPromoCodes[code]);
      toast.success(`Promo code applied! You saved $${validPromoCodes[code]}`);
    } else {
      setDiscount(0);
      toast.error("Invalid promo code");
    }
  };

  const handleStripePayment = async (data: FormData): Promise<string | false> => {
    if (!stripe || !elements) {
      toast.error("Stripe has not loaded yet.");
      return false;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Card element not found.");
      return false;
    }

    const shippingCost = fedex ? 32 : dhl ? 15 : 0;
    const totalAmount = itemTotal + itemQuantity * 3 + shippingCost - discount;

    const clientSecret = await createPayment(totalAmount);
    if (!clientSecret) return false;

    const countryMap: { [key: string]: string } = { Pakistan: "PK", India: "IN", America: "US" };
    const countryCode = countryMap[data.country] || "PK";

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${data.fname} ${data.lname}`,
          email: data.email,
          address: {
            line1: data.address,
            city: data.city,
            country: countryCode,
            postal_code: data.zip.toString(),
          },
        },
      },
    });

    if (error) {
      setCardError(error.message || "Payment error");
      toast.error(`Payment failed: ${error.message}`);
      return false;
    } else if (paymentIntent?.status === "succeeded") {
      toast.success("Payment successful!");
      return paymentIntent.id;
    }
    return false;
  };

  const checkCart = () => {
    const cart = getFromStorage("cart", []);
    if (cart.length === 0) {
      router.push("/");
    }
  };

  useEffect(() => setMounted(true), []);


  useEffect(() => {
    if (!orderPlaced) {
      checkCart();
    }
  }, [cartItems, orderPlaced]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (loading) return;
      setLoading(true);

      if (!cartItems || cartItems.length === 0) {
        toast.error("Cart is empty");
        setLoading(false);
        return;
      }

      const products = cartItems.map((item: any) => ({
        product: item._id,
        name: item.name || "Unnamed product",
        image: Array.isArray(item.image) ? item.image[0] : item.image,
        price: item.price || 0,
        quantity: item.quantity || 1,
        variation: item.selectedOptions || null,
        attributes: item.attributes || null,
      }));

      const shippingAddress = difadd
        ? {
            address: data.shipAddress || "",
            city: data.shipCity || "",
            country: data.shipCountry || "",
            zip: data.shipZip || "",
          }
        : {
            address: data.address,
            city: data.city,
            country: data.country,
            zip: data.zip,
          };

      const subtotal = itemTotal;
      const tax = itemQuantity * 3;
      const shippingCost = fedex ? 32 : dhl ? 15 : 0;
      const totalAmount = subtotal + tax + shippingCost - discount;

      let stripePaymentId: any = null;
      if (data.paymentMethod === "creditcard") {
        stripePaymentId = await handleStripePayment(data);
        if (!stripePaymentId) {
          setLoading(false);
          return;
        }
      }

      const orderData = {
        // Conditionally include userId if user is logged in
        ...(user && user._id ? { userId: user._id } : {}),
        products,
        shippingAddress,
        billingMethod: data.billingMethod,
        paymentMethod: data.paymentMethod,
        stripePaymentId,
        fname: data.fname,
        lname: data.lname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country,
        zip: data.zip,
        subtotal,
        tax,
        shippingCost,
        totalAmount,
        notes: data.notes || "",
      };

      console.log("Sending order data:", orderData);

      const res = await axios.post<{ order: { orderNumber: string } }>(
        `${API_BASE_URL}/api/orders`,
        orderData
      );

      const orderNumber = res.data?.order?.orderNumber;
      if (!orderNumber) {
        toast.error("Order number missing from response");
        setLoading(false);
        return;
      }

      dispatch(deleteCart());
      setToStorage("cart", []);

      setOrderPlaced(true);
      toast.success("Order placed successfully!");
      router.push(`/order-success/${orderNumber}`);
    } catch (error: any) {
      console.error("Order submission error:", error);
      toast.error(error?.response?.data?.message || "Order submission failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBillingMethodChange = (method: string) => {
    setFedex(method === "fedex");
    setDhl(method === "dhl");
  };

  const handlePaymentMethodChange = (method: string) => {
    setCard(method === "creditcard");
    setPaypal(method === "paypal");
    setBitcoin(method === "bitcoin");
  };

  if (!mounted) {
  return null;
}

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="p-10">
          <h2 className="font-semibold text-3xl">
            <img src="/checkout.svg" className="h-9 w-auto inline" alt="Checkout" /> Checkout
          </h2>
          {!user && (
            <p className="text-gray-600 mt-2">
              Checking out as a guest? No account needed!{' '}
              <Link href="/login" className="text-blue-600 underline">
                Log in
              </Link>{' '}
              for a personalized experience.
            </p>
          )}
        </div>

        <div className="grid grid-cols-4 gap-7 px-10 pt-1">
          <div className="col-span-3 ring ring-gray-200 rounded-3xl pb-4 px-4 pt-1">
            <div className="col-span-4 mt-2">
              <h2 className="text-2xl font-semibold">Billing info</h2>
              <p className="font-extralight text-gray-400">
                Please enter your billing info
              </p>
            </div>

            <div className="px-5 py-7 bg-gray-50">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label htmlFor="fname" className="font-semibold">
                    First name *
                  </label>
                  <input
                    type="text"
                    {...register("fname", { required: "First name is required" })}
                    id="fname"
                    defaultValue={user?.fname || ""}
                    placeholder="First Name"
                    className="px-3 bg-white ring-1 ring-gray-100 py-2 rounded-[13px]"
                  />
                  {errors.fname && <span className="text-red-500 text-sm">{errors.fname.message}</span>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="lname" className="font-semibold">
                    Last name *
                  </label>
                  <input
                    type="text"
                    {...register("lname", { required: "Last name is required" })}
                    id="lname"
                    defaultValue={user?.lname || ""}
                    placeholder="Last Name"
                    className="px-3 bg-white ring-1 ring-gray-100 py-2 rounded-[13px]"
                  />
                  {errors.lname && <span className="text-red-500 text-sm">{errors.lname.message}</span>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="email" className="font-semibold">
                    Email address *
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                    id="email"
                    defaultValue={user?.email || ""}
                    placeholder="Email address"
                    className="px-3 bg-white ring-1 ring-gray-100 py-2 rounded-[13px]"
                  />
                  {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="phone" className="font-semibold">
                    Phone number *
                  </label>
                  <input
                    type="text"
                    {...register("phone", { required: "Phone number is required" })}
                    id="phone"
                    defaultValue={user?.phone || ""}
                    placeholder="Phone Number"
                    className="px-3 bg-white ring-1 ring-gray-100 py-2 rounded-[13px]"
                  />
                  {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="address" className="font-semibold">
                    Address *
                  </label>
                  <input
                    type="text"
                    {...register("address", { required: "Address is required" })}
                    id="address"
                    placeholder="Address"
                    className="px-3 bg-white ring-1 ring-gray-100 py-2 rounded-[13px]"
                  />
                  {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="city" className="font-semibold">
                    Town/City *
                  </label>
                  <input
                    type="text"
                    {...register("city", { required: "City is required" })}
                    id="city"
                    placeholder="Town or City"
                    className="px-3 bg-white ring-1 ring-gray-100 py-2 rounded-[13px]"
                  />
                  {errors.city && <span className="text-red-500 text-sm">{errors.city.message}</span>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="country" className="font-semibold">
                    State/Country *
                  </label>
                  <select
                    {...register("country", { required: "Country is required" })}
                    id="country"
                    className="bg-white px-3 ring-1 ring-gray-100 py-2 rounded-[13px]"
                  >
                    <option value="">Choose Country</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="India">India</option>
                    <option value="America">America</option>
                  </select>
                  {errors.country && <span className="text-red-500 text-sm">{errors.country.message}</span>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="zip" className="font-semibold">
                    ZIP/Postal Code *
                  </label>
                  <input
                    type="text"
                    {...register("zip", { required: "ZIP code is required" })}
                    id="zip"
                    placeholder="Postal code or ZIP"
                    className="px-3 bg-white ring-1 ring-gray-100 py-2 rounded-[13px]"
                  />
                  {errors.zip && <span className="text-red-500 text-sm">{errors.zip.message}</span>}
                </div>

                <div className="col-span-2 bg-white flex gap-2 w-fit px-3 py-2 ring-1 ring-gray-100 rounded-[13px]">
                  <input
                    onClick={(e: any) => setDifadd(e.target.checked)}
                    type="checkbox"
                    {...register("shipadd")}
                    id="shipadd"
                  />
                  <label htmlFor="shipadd">Ship to a different address?</label>
                </div>

                {difadd && (
                  <div className="col-span-2 space-y-4">
                    <h3 className="text-xl font-semibold">Shipping Address</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <input
                          type="text"
                          {...register("shipAddress", { required: difadd ? "Shipping address is required" : false })}
                          placeholder="Shipping Address"
                          className="px-3 bg-white ring-1 ring-gray-100 py-2 rounded-[13px]"
                        />
                        {errors.shipAddress && <span className="text-red-500 text-sm">{errors.shipAddress.message}</span>}
                      </div>
                      <div className="flex flex-col">
                        <input
                          type="text"
                          {...register("shipCity", { required: difadd ? "Shipping city is required" : false })}
                          placeholder="Shipping City"
                          className="px-3 bg-white ring-1 ring-gray-100 py-2 rounded-[13px]"
                        />
                        {errors.shipCity && <span className="text-red-500 text-sm">{errors.shipCity.message}</span>}
                      </div>
                      <div className="flex flex-col">
                        <select
                          {...register("shipCountry", { required: difadd ? "Shipping country is required" : false })}
                          className="px-3 bg-white ring-1 ring-gray-100 py-2 rounded-[13px]"
                        >
                          <option value="">Choose Country</option>
                          <option value="Pakistan">Pakistan</option>
                          <option value="India">India</option>
                          <option value="America">America</option>
                        </select>
                        {errors.shipCountry && <span className="text-red-500 text-sm">{errors.shipCountry.message}</span>}
                      </div>
                      <div className="flex flex-col">
                        <input
                          type="text"
                          {...register("shipZip", { required: difadd ? "Shipping ZIP is required" : false })}
                          placeholder="Shipping ZIP"
                          className="px-3 bg-white ring-1 ring-gray-100 py-2 rounded-[13px]"
                        />
                        {errors.shipZip && <span className="text-red-500 text-sm">{errors.shipZip.message}</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-semibold">Billing Method</h2>
              <p className="font-extralight text-gray-400">Please enter your billing method</p>
            </div>
            <div className="p-5 flex flex-col gap-6 bg-gray-50">
              <label htmlFor="fedex" className="flex justify-between bg-white w-full p-3 rounded-[13px] ring-1 ring-gray-100">
                <div>
                  <input
                    type="radio"
                    {...register("billingMethod", { required: "Please select a billing method" })}
                    value="fedex"
                    id="fedex"
                    onChange={() => handleBillingMethodChange("fedex")}
                    className="w-max mr-3"
                  />
                  <label htmlFor="fedex">Fedex</label>
                </div>
                <h1>
                  <span className="text-green-500 mx-4">+$32 USD</span>Additional Price
                </h1>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-auto" viewBox="10 45.67 160.003 44.33"><path d="M169.018 84.244c0-2.465-1.748-4.27-4.156-4.27-2.404 0-4.154 1.805-4.154 4.27 0 2.461 1.75 4.263 4.154 4.263 2.408 0 4.156-1.805 4.156-4.263zm-5.248.219v2.789h-.901v-6.15h2.239c1.312 0 1.914.573 1.914 1.69 0 .688-.465 1.233-1.064 1.312v.026c.52.083.711.547.818 1.396.082.55.191 1.504.387 1.728h-1.066c-.248-.578-.223-1.396-.414-2.081-.158-.521-.436-.711-1.033-.711h-.875v.003l-.005-.002zm1.117-.795c.875 0 1.125-.466 1.125-.877 0-.486-.25-.87-1.125-.87h-1.117v1.749h1.117v-.002zm-5.17.576c0-3.037 2.411-5.09 5.141-5.09 2.738 0 5.146 2.053 5.146 5.09 0 3.031-2.407 5.086-5.146 5.086-2.73 0-5.141-2.055-5.141-5.086z" fill="#ff5a00"/><g fill="#ff5a00"><path d="M141.9 88.443l-5.927-6.647-5.875 6.647h-12.362l12.082-13.574-12.082-13.578h12.748l5.987 6.596 5.761-6.596h12.302l-12.022 13.521 12.189 13.631zM93.998 88.443V45.67h23.738v9.534h-13.683v6.087h13.683v9.174h-13.683v8.42h13.683v9.558z"/></g><path d="M83.98 45.67v17.505h-.111c-2.217-2.548-4.988-3.436-8.201-3.436-6.584 0-11.544 4.479-13.285 10.396-1.986-6.521-7.107-10.518-14.699-10.518-6.167 0-11.035 2.767-13.578 7.277V61.29H21.361v-6.085h13.91v-9.533H10v42.771h11.361V70.465h11.324a17.082 17.082 0 0 0-.519 4.229c0 8.918 6.815 15.185 15.516 15.185 7.314 0 12.138-3.437 14.687-9.694h-9.737c-1.316 1.883-2.316 2.439-4.949 2.439-3.052 0-5.686-2.664-5.686-5.818h19.826C62.683 83.891 68.203 90 75.779 90c3.268 0 6.26-1.607 8.089-4.322h.11v2.771h10.017V45.672H83.98v-.002zM42.313 70.593c.633-2.718 2.74-4.494 5.37-4.494 2.896 0 4.896 1.721 5.421 4.494H42.313zm35.588 11.341c-3.691 0-5.985-3.439-5.985-7.031 0-3.84 1.996-7.529 5.985-7.529 4.139 0 5.788 3.691 5.788 7.529 0 3.638-1.746 7.031-5.788 7.031z" fill="#29007c"/></svg>
                </div>
              </label>

              <label htmlFor="dhl" className="flex justify-between bg-white w-full p-3 rounded-[13px] ring-1 ring-gray-100">
                <div>
                  <input
                    type="radio"
                    {...register("billingMethod", { required: "Please select a billing method" })}
                    value="dhl"
                    id="dhl"
                    onChange={() => handleBillingMethodChange("dhl")}
                    className="w-max mr-3"
                  />
                  <label htmlFor="dhl">DHL</label>
                </div>
                <h1>
                  <span className="text-green-500 mx-4">+$15 USD</span>Additional Price
                </h1>
                <div>
                  <svg className="h-4 w-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 196 27.7183">
                    <g fill="#d40511">
                      <path d="M0 22.1h26.506l-1.448 1.971H0V22.1zM0 18.445h29.199l-1.451 1.967H0v-1.967zM0 25.759h23.815l-1.442 1.957H0v-1.957zM196 24.071h-26.402l1.447-1.969H196v1.969zM196 27.716l-29.087.002 1.441-1.959H196v1.957zM173.735 18.445H196v1.969l-23.713.001 1.448-1.97zM25.673 27.716l12.578-17.09h15.608c1.725 0 1.702.656.86 1.798-.857 1.16-2.314 3.155-3.186 4.333-.442.598-1.243 1.688 1.41 1.688h20.91c-1.74 2.382-7.38 9.27-17.509 9.27ZM97.706 18.443l-6.82 9.273H72.893s6.817-9.271 6.823-9.271l17.99-.002ZM123.724 18.445l-6.824 9.27H98.914s6.818-9.27 6.824-9.27ZM129.575 18.445s-1.314 1.797-1.953 2.66c-2.26 3.053-.263 6.61 7.111 6.61h28.885l6.823-9.271Z"></path>
                      <path d="m34.468 0-6.262 8.508h34.13c1.724 0 1.702.655.859 1.797-.857 1.16-2.29 3.177-3.162 4.354-.443.597-1.243 1.687 1.409 1.687h13.956s2.25-3.062 4.136-5.62C82.099 7.243 79.756 0 70.585 0ZM125.269 16.346H81.262L93.296 0h17.986l-6.896 9.372h8.028L119.315 0h17.984l-12.03 16.346zM162.208 0l-12.031 16.346h-19.06S143.154 0 143.16 0Z"></path>
                    </g>
                  </svg>
                </div>
              </label>
              {errors.billingMethod && <span className="text-red-500 text-sm">{errors.billingMethod.message}</span>}
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-semibold">Payment Method</h2>
              <p className="font-extralight text-gray-400">Please enter your payment method</p>
            </div>
            <div className="p-5 flex flex-col gap-6 bg-gray-50">
              <label htmlFor="creditcard" className="ring-1 ring-gray-100 bg-white rounded-[13px] p-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      {...register("paymentMethod", { required: "Please select a payment method" })}
                      value="creditcard"
                      id="creditcard"
                      onChange={() => handlePaymentMethodChange("creditcard")}
                      className="mr-3"
                    />
                    <label htmlFor="creditcard">Credit card</label>
                  </div>
                  <div className="flex gap-4">
                    <img className="h-10 w-auto" src="/visa.svg" alt="Visa" />
                    <img className="h-10 w-auto" src="/mcard.svg" alt="Mastercard" />
                  </div>
                </div>
                {card && (
                  <div className="mt-6">
                    <label className="font-semibold mb-2 block">Enter your card details</label>
                    <div className="p-4 bg-white rounded-[13px] ring-1 ring-gray-100">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              color: "#32325d",
                              fontFamily: "sans-serif",
                              "::placeholder": { color: "#a0aec0" },
                            },
                            invalid: {
                              color: "#fa755a",
                              iconColor: "#fa755a",
                            },
                          },
                        }}
                      />
                      {cardError && <span className="text-red-500 text-sm">{cardError}</span>}
                    </div>
                    <p className="text-gray-500 text-sm mt-2">
                      Your payment is secure and encrypted by Stripe.
                    </p>
                  </div>
                )}
              </label>

              <label htmlFor="paypal" className="ring-1 ring-gray-100 bg-white p-3 rounded-[13px]">
                <div className="flex justify-between items-center">
                  <div>
                    <input
                      type="radio"
                      {...register("paymentMethod", { required: "Please select a payment method" })}
                      value="paypal"
                      id="paypal"
                      onChange={() => handlePaymentMethodChange("paypal")}
                      className="mr-3"
                    />
                    <label htmlFor="paypal">PayPal</label>
                  </div>
                  <div>
                    <img className="h-10 w-auto" src="/paypal.svg" alt="PayPal" />
                  </div>
                </div>
                {paypal && (
                  <div className="py-4">
                    <p className="text-gray-600">You will be redirected to PayPal to complete your payment.</p>
                  </div>
                )}
              </label>

              <label htmlFor="bitcoin" className="ring-1 ring-gray-100 bg-white p-3 rounded-[13px]">
                <div className="flex justify-between items-center">
                  <div>
                    <input
                      type="radio"
                      {...register("paymentMethod", { required: "Please select a payment method" })}
                      value="bitcoin"
                      id="bitcoin"
                      onChange={() => handlePaymentMethodChange("bitcoin")}
                      className="mr-3"
                    />
                    <label htmlFor="bitcoin">Cash on delivery</label>
                  </div>
                  <div>
                    {/* <img className="h-10 w-auto" src="/bitcoin.svg" alt="Bitcoin" /> */}
                    <span className="font-semibold">COD</span>
                  </div>
                </div>
                {bitcoin && (
                  <div className="py-4">
                    <p className="text-gray-600">Bitcoin payment instructions will be provided after order confirmation.</p>
                  </div>
                )}
              </label>
              {errors.paymentMethod && <span className="text-red-500 text-sm">{errors.paymentMethod.message}</span>}
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-semibold">Additional information</h2>
              <p className="font-extralight text-gray-400">
                Need something else? We will make it for you!
              </p>
            </div>
            <div className="p-5 bg-gray-50">
              <div className="flex flex-col">
                <label htmlFor="notes" className="font-semibold mb-2">Order Notes</label>
                <textarea
                  className="bg-white w-full p-3 h-40 ring-1 ring-gray-100 rounded-[13px]"
                  {...register("notes")}
                  id="notes"
                  placeholder="Need a specific delivery day? Sending a gift? Let's say ..."
                />
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-semibold">Confirmation</h2>
              <p className="font-extralight text-gray-400">
                We are getting to the end. Just a few clicks and your order is ready!
              </p>
            </div>
            <div className="p-5 bg-gray-50 space-y-4">
              <div className="bg-white flex gap-2 px-3 w-fit py-2 ring-1 ring-gray-100 rounded-[13px]">
                <input
                  type="checkbox"
                  {...register("marketing")}
                  id="marketing"
                />
                <label htmlFor="marketing" className="select-none">
                  I agree with sending Marketing and newsletter emails.
                </label>
              </div>
              <div className="bg-white flex gap-2 w-fit px-3 py-2 ring-1 ring-gray-100 rounded-[13px]">
                <input
                  type="checkbox"
                  {...register("terms", { required: "You must agree to terms and conditions" })}
                  id="terms"
                />
                <label htmlFor="terms" className="select-none">
                  I agree with our <Link href="/terms" className="text-blue-600 underline">terms and conditions</Link> and{" "}
                  <Link href="/privacy" className="text-blue-600 underline">privacy policy</Link>
                </label>
              </div>
              {errors.terms && <span className="text-red-500 text-sm">{errors.terms.message}</span>}
            </div>

            <div className="p-5">
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : (
                  "Complete Order"
                )}
              </button>
            </div>
          </div>

          <div className="col-span-1">
            <div className="w-full bg-gray-50 py-4 rounded-3xl">
              <div className="pt-3 px-5">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                <div>
                  {cartItems.length === 0 ? (
                    <p className="text-center font-semibold p-3">Cart is Empty!</p>
                  ) : (
                    cartItems.map((item: any, index: number) => (
                      <div key={index} className="grid grid-cols-2 p-4 border-b border-gray-200">
                        <div className="relative min-h-20 min-w-20 w-20 h-20">
                          <img
                            src={`${API_BASE_URL}${Array.isArray(item.image) ? item.image[0] : item.image}`}
                            className="absolute inset-0 h-full w-full object-cover rounded"
                            alt={item.name}
                          />
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-gray-600">
                            ${item.price} x {item.quantity}
                          </p>
                          <p className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between">
                      <input
                        type="text"
                        className="flex-1 px-3 rounded-[13px] h-12 bg-white ring-1 ring-gray-200"
                        placeholder="Apply promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                     <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="ml-2 bg-black text-white px-4 rounded-[13px] hover:bg-gray-800"
                      >
                        Apply
                      </button>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${itemTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>${(itemQuantity * 3).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>
                        {fedex ? "$32.00" : dhl ? "$15.00" : "$0.00"}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>- ${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg pt-3 border-t border-gray-300">
                      <span>Total</span>
                      <span>
                        $
                        {(
                          itemTotal +
                          itemQuantity * 3 +
                          (fedex ? 32 : dhl ? 15 : 0) -
                          discount
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
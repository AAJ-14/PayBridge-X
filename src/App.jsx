import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [offline, setOffline] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);



  const [paymentMode, setPaymentMode] = useState("send");
const [sendMethod, setSendMethod] = useState("phone");
const [recipient, setRecipient] = useState("");
const [recipientName, setRecipientName] = useState("");
const [qrScanned, setQrScanned] = useState(false);
const [transactions, setTransactions] = useState(() => {
  const saved = localStorage.getItem("paybridge_transactions");

  if (saved) {
    return JSON.parse(saved);
  }

  return [
  {
    letter: "A",
    name: "Amit Sharma",
    mode: "UPI",
    amount: "₹150",
    status: "Completed",
  },
  {
    letter: "P",
    name: "Priya Shah",
    mode: "Offline",
    amount: "₹280",
    status: "Pending sync",
      },
  ];
});
useEffect(() => {
  localStorage.setItem(
    "paybridge_transactions",
    JSON.stringify(transactions)
  );
}, [transactions]);
    // AI Assistant
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const askPayBridge = () => {
    const question = aiInput.toLowerCase().trim();

    if (!question) return;

    let response = "";

    if (
      question.includes("income") ||
      question.includes("earn") ||
      question.includes("कमाई") ||
      question.includes("आमदनी")
    ) {
      response =
        "Your income this month is ₹28,500.";
    }

    else if (
      question.includes("save") ||
      question.includes("saving") ||
      question.includes("बचत")
    ) {
      response =
        "Your savings this month are ₹6,700, which is about 24% of your income.";
    }

    else if (
      question.includes("spend") ||
      question.includes("expense") ||
      question.includes("खर्च")
    ) {
      response =
        "Your largest expense category is Food & Dining at ₹6,800.";
    }

    else if (
      question.includes("today") ||
      question.includes("aaj") ||
      question.includes("आज")
    ) {
      response =
        "You received ₹2,850 today.";
    }

    else if (
      question.includes("transaction") ||
      question.includes("transactions")
    ) {
      response =
        "You have made 126 transactions this month.";
    }

    else if (
      question.includes("offline") ||
      question.includes("sync")
    ) {
      response =
        "You currently have 5 offline payments. They will synchronize when the internet connection returns.";
    }

    else {
      response =
        "I can help you with your income, savings, expenses, transactions and offline payments.";
    }

    setAiResponse(response);
  };


  // Voice Assistant
  const startVoiceAssistant = () => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setAiResponse(
        "Voice input is not supported by this browser. Please use Google Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setAiResponse("Listening... 🎙️");
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setAiInput(transcript);

      setTimeout(() => {
        askPayBridgeForVoice(transcript);
      }, 100);
    };

    recognition.onerror = () => {
      setAiResponse(
        "I couldn't hear that. Please try again."
      );
    };

    recognition.start();
  };


  const askPayBridgeForVoice = (text) => {

    const question = text.toLowerCase();

    let response = "";

    if (
      question.includes("income") ||
      question.includes("earn") ||
      question.includes("कमाई") ||
      question.includes("आमदनी")
    ) {
      response =
        "Your income this month is ₹28,500.";
    }

    else if (
      question.includes("save") ||
      question.includes("saving") ||
      question.includes("बचत")
    ) {
      response =
        "Your savings this month are ₹6,700.";
    }

    else if (
      question.includes("spend") ||
      question.includes("expense") ||
      question.includes("खर्च")
    ) {
      response =
        "Your largest expense is Food and Dining at ₹6,800.";
    }

    else if (
      question.includes("today") ||
      question.includes("aaj") ||
      question.includes("आज")
    ) {
      response =
        "You received ₹2,850 today.";
    }

    else {
      response =
        "I can help you with your income, savings, expenses and transactions.";
    }

    setAiResponse(response);
  };
  const goTo = (nextPage) => {
    setPage(nextPage);
    setPaymentDone(false);
  };

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="logo" onClick={() => goTo("home")}>
          <div className="logo-box">P</div>

          <div>
            <strong>PayBridge</strong>
            <span>X</span>
          </div>
        </div>

        <nav>

          <button
            className={page === "home" ? "nav-active" : ""}
            onClick={() => goTo("home")}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className={page === "pay" ? "nav-active" : ""}
            onClick={() => goTo("pay")}
          >
            <span>↗</span>
            Payments
          </button>

          <button
            className={page === "identity" ? "nav-active" : ""}
            onClick={() => goTo("identity")}
          >
            <span>◉</span>
            Money Footprint
          </button>

          <button
            className={page === "assistant" ? "nav-active" : ""}
            onClick={() => goTo("assistant")}
          >
            <span>✦</span>
            Ask PayBridge
          </button>

        </nav>

        <div className="sidebar-bottom">
          <span>●</span> Mumbai
          <small>Prototype</small>
        </div>

      </aside>


      {/* MAIN */}
      <main className="main">

        {/* TOPBAR */}
        <header className="topbar">

          <div className="status-area">

            <div className={offline ? "status offline" : "status online"}>
              <span></span>
              {offline ? "OFFLINE" : "ONLINE"}
            </div>

            <button
              className="network-button"
              onClick={() => {
  const goingOnline = offline;

  setOffline(!offline);

  if (goingOnline) {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.status === "Pending sync"
          ? { ...tx, status: "Completed" }
          : tx
      )
    );
  }
}}
            >
              {offline ? "Go Online" : "Go Offline"}
            </button>

          </div>

          <div
  className="profile"
  onClick={() => setProfileOpen(!profileOpen)}
>
            <div className="profile-circle">R</div>

            <div>
              <strong>Rajan</strong>
              <small>Merchant</small>
            </div>
          </div>

{profileOpen && (
  <div className="profile-popup">
    <div className="profile-popup-header">
      <div className="profile-popup-circle">R</div>
      <div>
        <strong>Rajan</strong>
        <small>Merchant</small>
      </div>
    </div>

    <div className="profile-popup-row">
      <span>Financial Footprint</span>
      <strong>82 / 100</strong>
    </div>

    <div className="profile-popup-row">
      <span>Today's Payments</span>
      <strong>₹2,850</strong>
    </div>

    <button
      className="profile-close"
      onClick={() => setProfileOpen(false)}
    >
      Close
    </button>
  </div>
)}
          

        </header>


        {/* ================= HOME ================= */}

        {page === "home" && (

          <section className="dashboard">

            <div className="welcome">
              <div>
                <small>DADAR · MUMBAI</small>

                <h1>
                  Payments don't stop.
                </h1>

                <p>
                  Even when the network does.
                </p>
              </div>

              <div className="offline-indicator">
                <span></span>
                {offline ? "Offline mode" : "Connected"}
              </div>
            </div>


            {/* HERO PAYMENT CARD */}

            <div className="payment-hero">

              <div className="hero-left">

                <small>READY TO RECEIVE</small>

                <h2>
                  ₹100
                </h2>

                <p>
                  Tap to record a payment
                </p>

                <button
                  className="tap-button"
                  onClick={() => goTo("pay")}
                >
                  Tap to Pay
                  <span>→</span>
                </button>

              </div>


              <div className="hero-visual">

                <div className="orbit orbit-1"></div>
                <div className="orbit orbit-2"></div>

                <div className="pay-core">
                  <span>₹</span>
                </div>

              </div>

            </div>


            {/* THREE STATS */}

            <div className="stats">

              <div className="stat-card">
                <small>TODAY</small>
                <strong>₹2,850</strong>
                <span>Income</span>
              </div>

              <div className="stat-card">
                <small>PENDING</small>
                <strong>
  {transactions.filter((tx) => tx.status === "Pending sync").length}
</strong>
                <span>To sync</span>
              </div>

              <div
                className="stat-card clickable"
                onClick={() => goTo("identity")}
              >
                <small>FOOTPRINT</small>
                <strong>82<span>/100</span></strong>
                <span>Building steadily</span>
              </div>

            </div>


            {/* RECENT PAYMENTS */}

            <div className="section-title">
              <h2>Recent payments</h2>
              <button onClick={() => goTo("pay")}>
                View all →
              </button>
            </div>


            <div className="transactions">

             {transactions.map((transaction, index) => (
  <Transaction
    key={index}
    letter={transaction.letter}
    name={transaction.name}
    mode={transaction.mode}
    amount={transaction.amount}
    status={transaction.status}
  />
))}

            </div>

          </section>

        )}

{/* ================= PAYMENTS ================= */}

{page === "pay" && (
  <section className="payments-page">

    {!paymentDone ? (
      <>
        {/* HEADER */}
        <div className="payments-header">
          <div>
            <small>PAYBRIDGE X · PAYMENTS</small>

            <h1>
              {paymentMode === "send"
                ? "Send money."
                : "Receive money."}
            </h1>

            <p>
              {paymentMode === "send"
                ? "Send money using a phone number, UPI ID or QR."
                : "Receive money through your PayBridge QR."}
            </p>
          </div>

          <div className={offline ? "pay-status offline" : "pay-status online"}>
            <span></span>
            {offline ? "OFFLINE MODE" : "ONLINE"}
          </div>
        </div>

        {/* SEND / RECEIVE TABS */}
        <div className="payment-tabs">

          <button
            className={paymentMode === "send" ? "active" : ""}
            onClick={() => {
              setPaymentMode("send");
              setRecipient("");
              setQrScanned(false);
              setAmount("");
            }}
          >
            ↑ Send Money
          </button>

          <button
            className={paymentMode === "receive" ? "active" : ""}
            onClick={() => {
              setPaymentMode("receive");
              setRecipient("");
              setQrScanned(false);
              setAmount("");
            }}
          >
            ↓ Receive Money
          </button>

        </div>

        {/* ================= SEND MONEY ================= */}

        {paymentMode === "send" && (
          <div className="send-payment-card">

            <div className="payment-card-title">
              <span>1</span>

              <div>
                <h3>Choose how to pay</h3>
                <p>Select the recipient method</p>
              </div>
            </div>

            {/* METHODS */}

            <div className="send-methods">

              <button
                className={sendMethod === "phone" ? "selected" : ""}
                onClick={() => {
                  setSendMethod("phone");
                  setRecipient("");
                  setQrScanned(false);
                }}
              >
                <div className="method-icon">📱</div>
                <strong>Phone</strong>
                <small>Mobile number</small>
              </button>

              <button
                className={sendMethod === "upi" ? "selected" : ""}
                onClick={() => {
                  setSendMethod("upi");
                  setRecipient("");
                  setQrScanned(false);
                }}
              >
                <div className="method-icon">@</div>
                <strong>UPI ID</strong>
                <small>username@upi</small>
              </button>

              <button
                className={sendMethod === "qr" ? "selected" : ""}
                onClick={() => {
                  setSendMethod("qr");
                  setRecipient("");
                  setQrScanned(false);
                }}
              >
                <div className="method-icon">▣</div>
                <strong>Scan QR</strong>
                <small>Scan recipient</small>
              </button>

            </div>

            {/* PHONE */}

            {sendMethod === "phone" && (
              <div className="payment-input-section">

                <label>Mobile Number</label>

                <div className="phone-input">
                  <span>+91</span>

                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={recipient}
                   onChange={(e) => {
  const value = e.target.value;
  setRecipient(value);

  if (value.replace(/\D/g, "").length === 10) {
    setRecipientName("Priya Shah");
  } else {
    setRecipientName("");
  }
}}
                  />
                  {recipientName && (
  <div className="recipient-preview">
    <div className="recipient-avatar">
      {recipientName.charAt(0)}
    </div>

    <div>
      <small>RECIPIENT FOUND</small>
      <strong>{recipientName}</strong>
      <span>Verified PayBridge demo recipient</span>
    </div>

    <div className="recipient-check">✓</div>
  </div>
)}
                </div>

              </div>
            )}

            {/* UPI */}

            {sendMethod === "upi" && (
              <div className="payment-input-section">

                <label>UPI ID</label>

                <input
  type="text"
  placeholder="Enter UPI ID"
  value={recipient}
  onChange={(e) => {
    const value = e.target.value;
    setRecipient(value);

    if (value.toLowerCase() === "priya@paybridge") {
      setRecipientName("Priya Shah");
    } else {
      setRecipientName("");
    }
  }}
/>
  {recipientName && (
  <div className="recipient-preview">
    <div className="recipient-avatar">
      {recipientName.charAt(0)}
    </div>

    <div>
      <small>RECIPIENT FOUND</small>
      <strong>{recipientName}</strong>
      <span>Verified PayBridge demo recipient</span>
    </div>

    <div className="recipient-check">✓</div>
  </div>
)}

              </div>
            )}

            {/* QR */}

            {sendMethod === "qr" && (
              <div className="qr-section">

                {!qrScanned ? (
                  <>
                    <div className="qr-scanner">

                      <div className="scanner-corner top-left"></div>
                      <div className="scanner-corner top-right"></div>
                      <div className="scanner-corner bottom-left"></div>
                      <div className="scanner-corner bottom-right"></div>

                      <div className="scanner-line"></div>

                      <span>▣</span>

                    </div>

                    <p>Position the recipient's QR inside the frame</p>

                    <button
                      className="simulate-scan"
                      onClick={() => {
  setQrScanned(true);
  setRecipient("demo-qr-amit");
  setRecipientName("Amit Sharma");
}}
                    >
                      Simulate QR Scan
                    </button>
                  </>
                ) : (
                  <div className="qr-success">

                    <div className="qr-success-icon">✓</div>

                    <strong>Amit Sharma</strong>

                    <small>Recipient verified</small>

                  </div>
                  
                )}

              </div>
            )}

            {/* AMOUNT */}

            <div className="amount-section">

              <label>Amount</label>

              <div className="amount-input">

                <span>₹</span>

                <input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

              </div>

            </div>

            {/* CONFIRM */}

            <button
              className="payment-confirm-button"
              disabled={
                !amount ||
                (sendMethod !== "qr" && !recipient) ||
                (sendMethod === "qr" && !qrScanned)
              }
              onClick={() => {
  if (!amount || !recipient) return;

  const newTransaction = {
    letter: recipient.charAt(0).toUpperCase(),
    name: recipientName || recipient,
    mode:
  sendMethod === "phone"
    ? "Phone"
    : sendMethod === "upi"
    ? "UPI"
    : "QR",

network: offline ? "Offline" : "Online",

status: offline ? "Pending sync" : "Completed",
  };

  setTransactions((prev) => [
    newTransaction,
    ...prev,
  ]);

  setPaymentDone(true);
}}
            >
              <span>
                {offline
                  ? "Record Offline Payment"
                  : `Send ₹${amount || "0"}`}
              </span>

              <strong>→</strong>
            </button>

            <div className="prototype-note">
              <span>ⓘ</span>
              Prototype simulation · No real money is transferred
            </div>
                  {qrScanned && recipientName && (
  <div className="recipient-preview">
    <div className="recipient-avatar">
      {recipientName.charAt(0)}
    </div>

    <div>
      <small>QR RECIPIENT FOUND</small>
      <strong>{recipientName}</strong>
      <span>Verified PayBridge demo recipient</span>
    </div>

    <div className="recipient-check">✓</div>
  </div>
)}
          </div>
        )}

        {/* ================= RECEIVE MONEY ================= */}

        {paymentMode === "receive" && (
          <div className="receive-payment-card">

            <div className="receive-left">

              <div className="payment-card-title">
                <span>1</span>

                <div>
                  <h3>Your PayBridge QR</h3>
                  <p>Let the customer scan this QR to pay you</p>
                </div>
              </div>

              <div className="my-qr-box">

                <div className="fake-qr">
                  <div>▦</div>
                </div>

                <strong>Rajan Fruit & Veg Stall</strong>

                <small>paybridge@rajan</small>

              </div>

            </div>

            <div className="receive-right">

              <div className="amount-section">

                <label>Amount to receive</label>

                <div className="amount-input">

                  <span>₹</span>

                  <input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />

                </div>

              </div>

              <button
                className="payment-confirm-button"
                disabled={!amount}
                onClick={() => {
  if (amount && recipient) {
    setTransactions((prev) => [
      {
        letter: recipientName
          ? recipientName.charAt(0)
          : recipient.charAt(0).toUpperCase(),
        name: recipientName || recipient,
        mode: offline ? "Offline" : "UPI",
        amount: `₹${amount}`,
        status: offline ? "Pending sync" : "Completed",
      },
      ...prev,
    ]);

    setPaymentDone(true);
  }
}}
              >
                <span>
                  {offline
                    ? "Record Offline Receipt"
                    : `Receive ₹${amount}`}
                </span>

                <strong>→</strong>
              </button>

              <div className="prototype-note">
                <span>ⓘ</span>
                Prototype simulation · No real money is transferred
              </div>

            </div>

          </div>
        )}

      </>
    ) : (

      /* ================= SUCCESS ================= */

      <div className="payment-success-new">

        <div className="success-animation">✓</div>

        <small>
          {paymentMode === "send"
            ? "PAYMENT RECORDED"
            : "PAYMENT RECEIVED"}
        </small>

        <h1>₹{amount}</h1>

        <p className="success-subtitle">

          {offline
            ? "Your transaction has been stored locally."
            : "Your transaction has been successfully recorded."}

        </p>

        <div className="transaction-card">

          <div>
            <span>
              {paymentMode === "send"
                ? "RECIPIENT"
                : "MERCHANT"}
            </span>

            <strong>
              {paymentMode === "send"
                ? recipientName || recipient || "Demo Recipient"
                : "Rajan Fruit & Veg Stall"}
            </strong>
          </div>

          <div>
            <span>MODE</span>

            <strong>
              {offline
                ? "Offline Payment"
                : "Online Payment"}
            </strong>
          </div>

          <div>
            <span>STATUS</span>

            <strong className={offline ? "pending" : "completed"}>
              {offline
                ? "Waiting to sync"
                : "Completed"}
            </strong>
          </div>

        </div>

        {offline && (
          <div className="sync-notice">

            <div className="sync-dot"></div>

            <div>
              <strong>Stored locally</strong>

              <p>
                This transaction will synchronize when
                the internet connection returns.
              </p>
            </div>

          </div>
        )}

        <div className="success-actions">

          <button
            className="primary-action"
            onClick={() => {
              setPaymentDone(false);
              setAmount("");
              setRecipient("");
              setQrScanned(false);
            }}
          >
            Make another payment
          </button>

          <button
            className="secondary-action"
            onClick={() => goTo("home")}
          >
            Back to Dashboard
          </button>

        </div>

      </div>

    )}

  </section>
)}


        
        {/* ================= MONEY FOOTPRINT ================= */}

{page === "identity" && (
  <section className="footprint-page">

    {/* HEADER */}

    <div className="footprint-header">

      <div>
        <small>PAYBRIDGE X · MONEY FOOTPRINT</small>

        <h1>Your financial story.</h1>

        <p>
          A simple view of your digital payment activity and financial behaviour.
        </p>
      </div>

      <div className="footprint-period">
        <span>PERIOD</span>
        <strong>This Month</strong>
      </div>

    </div>


    {/* FINANCIAL IDENTITY HERO */}

    <div className="footprint-hero">

      <div className="footprint-score">

        <small>FINANCIAL IDENTITY</small>

        <div className="score-number">
          {Math.min(
  100,
  80 + transactions.filter((tx) => tx.status === "Completed").length * 2
)}
<span>/100</span>
        </div>

        <div className="score-status">
          <span></span>
          Building steadily
        </div>

        <p>
          Your payment activity is creating a consistent financial footprint.
        </p>

      </div>


      <div className="score-ring">

        <div className="score-ring-inner">
          <strong>82</strong>
          <span>FOOTPRINT</span>
        </div>

      </div>

    </div>


    {/* FINANCIAL METRICS */}

    <div className="footprint-metrics">

      <div className="footprint-metric-card">

        <span className="metric-label">INCOME</span>

        <strong>₹28,500</strong>

        <small className="metric-positive">
          ↑ 12% this month
        </small>

      </div>


      <div className="footprint-metric-card">

        <span className="metric-label">EXPENSES</span>

        <strong>₹21,800</strong>

        <small>
          76% of income
        </small>

      </div>


      <div className="footprint-metric-card">

        <span className="metric-label">SAVINGS</span>

        <strong>₹6,700</strong>

        <small className="metric-positive">
          24% saved
        </small>

      </div>


      <div className="footprint-metric-card">

        <span className="metric-label">TRANSACTIONS</span>

        <strong>126</strong>

        <small>
          This month
        </small>

      </div>

    </div>


    {/* TWO COLUMN AREA */}

    <div className="footprint-grid">


      {/* PAYMENT RELIABILITY */}

      <div className="footprint-card">

        <div className="footprint-card-header">

          <div>
            <small>PAYMENT BEHAVIOUR</small>
            <h3>Payment reliability</h3>
          </div>

          <strong>94%</strong>

        </div>


        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: "94%" }}
          ></div>
        </div>


        <div className="reliability-items">

          <div>
            <span>Completed payments</span>
            <strong>
  {transactions.filter((tx) => tx.status === "Completed").length}
</strong>
          </div>

          <div>
            <span>Pending payments</span>
            <strong>
  {transactions.filter((tx) => tx.status === "Pending sync").length}
</strong>
          </div>

          <div>
            <span>Offline payments</span>
            <strong>
  {transactions.filter(
    (tx) => tx.network === "Offline" || tx.mode === "Offline"
  ).length}
</strong>
          </div>

        </div>

      </div>


      {/* DIGITAL ACTIVITY */}

      <div className="footprint-card">

        <div className="footprint-card-header">

          <div>
            <small>PAYMENT CHANNEL</small>
            <h3>Digital activity</h3>
          </div>

          <strong>94%</strong>

        </div>


        <div className="activity-bar">

          <div
            className="online-bar"
            style={{ width: "78%" }}
          >
            <span>Online 78%</span>
          </div>

          <div
            className="offline-bar"
            style={{ width: "16%" }}
          >
            <span>Offline 16%</span>
          </div>

          <div
            className="cash-bar"
            style={{ width: "6%" }}
          >
            <span>Cash 6%</span>
          </div>

        </div>


        <div className="activity-legend">

          <span>
            <i className="legend-online"></i>
            Online
          </span>

          <span>
            <i className="legend-offline"></i>
            Offline
          </span>

          <span>
            <i className="legend-cash"></i>
            Cash
          </span>

        </div>

      </div>

    </div>


    {/* SPENDING BREAKDOWN */}

    <div className="footprint-card spending-card">

      <div className="footprint-card-header">

        <div>
          <small>EXPENSE ANALYSIS</small>
          <h3>Where your money goes</h3>
        </div>

        <span className="view-period">
          This month
        </span>

      </div>


      <div className="spending-list">


        <div className="spending-row">

          <div className="spending-name">
            <span className="spending-icon">🍛</span>

            <div>
              <strong>Food & Dining</strong>
              <small>32 transactions</small>
            </div>
          </div>

          <div className="spending-value">
            <strong>₹6,800</strong>
            <span>31%</span>
          </div>

        </div>


        <div className="spending-row">

          <div className="spending-name">
            <span className="spending-icon">🚕</span>

            <div>
              <strong>Transport</strong>
              <small>18 transactions</small>
            </div>
          </div>

          <div className="spending-value">
            <strong>₹4,200</strong>
            <span>19%</span>
          </div>

        </div>


        <div className="spending-row">

          <div className="spending-name">
            <span className="spending-icon">🏪</span>

            <div>
              <strong>Business</strong>
              <small>21 transactions</small>
            </div>
          </div>

          <div className="spending-value">
            <strong>₹3,900</strong>
            <span>18%</span>
          </div>

        </div>


        <div className="spending-row">

          <div className="spending-name">
            <span className="spending-icon">📱</span>

            <div>
              <strong>Bills & Recharge</strong>
              <small>9 transactions</small>
            </div>
          </div>

          <div className="spending-value">
            <strong>₹2,700</strong>
            <span>12%</span>
          </div>

        </div>


        <div className="spending-row">

          <div className="spending-name">
            <span className="spending-icon">🛍️</span>

            <div>
              <strong>Shopping</strong>
              <small>14 transactions</small>
            </div>
          </div>

          <div className="spending-value">
            <strong>₹2,100</strong>
            <span>10%</span>
          </div>

        </div>


      </div>

    </div>


    {/* AI INSIGHT */}

    <div className="footprint-ai-insight">

      <div className="ai-insight-icon">✦</div>

      <div>

        <small>PAYBRIDGE AI INSIGHT</small>

        <h3>
          You're building a consistent financial footprint.
        </h3>

        <p>
          Your savings rate is currently 24%. If your income remains
          consistent, setting aside around ₹1,500 more this month could
          strengthen your savings behaviour.
        </p>

      </div>

    </div>


    {/* PROTOTYPE DISCLAIMER */}

    <div className="footprint-disclaimer">

      <span>ⓘ</span>

      This Financial Identity score is a conceptual prototype indicator,
      not an official credit score.

    </div>

  </section>
)}




        {/* ================= AI ================= */}

{page === "assistant" && (
  <section className="ai-page">

    <div className="ai-page-heading">
      <small>PAYBRIDGE AI</small>

      <h1>Ask about your money.</h1>

      <p>English · हिन्दी · मराठी</p>
    </div>


    <div className="ai-card">

      {/* GREETING */}

      <div className="ai-message">
        <strong>Namaste Rajan 👋</strong>
        <br />
        Bolo, kya check karna hai?
      </div>


      {/* QUICK QUESTIONS */}

      <div className="suggestions">

        <button
          onClick={() =>
            setAiInput("Aaj kitna paisa aaya?")
          }
        >
          Aaj kitna paisa aaya?
        </button>

        <button
          onClick={() =>
            setAiInput("Meri income kitni hai?")
          }
        >
          Meri income?
        </button>

        <button
          onClick={() =>
            setAiInput("Maine kitna save kiya?")
          }
        >
          Meri savings?
        </button>

        <button
          onClick={() =>
            setAiInput("Where did I spend the most?")
          }
        >
          Where did I spend the most?
        </button>

      </div>


      {/* AI RESPONSE */}

      {aiResponse && (
        <div className="ai-response">

          <div className="ai-response-icon">
            ✦
          </div>

          <div>
            <small>PAYBRIDGE AI</small>

            <p>{aiResponse}</p>
          </div>

        </div>
      )}


      {/* INPUT */}

      <div className="ai-input">

        <input
          value={aiInput}
          onChange={(e) =>
            setAiInput(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              askPayBridge();
            }
          }}
          placeholder="Ask PayBridge..."
        />

        <button onClick={askPayBridge}>
          →
        </button>

      </div>


      {/* VOICE */}

      <button
        className="voice-button"
        onClick={startVoiceAssistant}
      >
        🎙️
        <span>Ask with voice</span>
      </button>


      <div className="ai-note">
        Prototype AI · Responses are based on demo financial data
      </div>

    </div>

  </section>
)}

        

      </main>

    </div>
  );
}


/* TRANSACTION */

function Transaction({ letter, name, mode, amount, status }) {

  return (
    <div className="transaction">

      <div className="person">

        <div className="person-avatar">
          {letter}
        </div>

        <div>
          <strong>{name}</strong>
          <small>Received · {mode}</small>
        </div>

      </div>

      <div className="transaction-right">

        <strong>+{amount}</strong>

        <small className={status === "Completed" ? "green" : "orange"}>
          {status}
        </small>

      </div>

    </div>
  );
}


/* METRIC */

function Metric({ name, value }) {

  return (
    <div className="metric">

      <div>
        <span>{name}</span>
        <strong>{value}</strong>
      </div>

      <div className="metric-bar">
        <span style={{ width: value }}></span>
      </div>

    </div>
  );
}

export default App;
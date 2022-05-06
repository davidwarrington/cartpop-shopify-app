import { Fragment, useCallback, useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";

// import { LocaleProvider, ShopProvider } from "./hooks/index";
import { APP_STATES } from "./constants";

export function App() {
  const webcamRef = useRef(null);
  const [status, setStatus] = useState(APP_STATES.idle);
  const [imgSrc, setImgSrc] = useState(null);
  const [source, setSource] = useState("environment");
  const [description, setDescription] = useState("");

  const videoConstraints = {
    facingMode: { exact: source },
  };

  console.log("videoConstraints", videoConstraints);

  useEffect(() => {
    if (!imgSrc) {
      return;
    }

    setStatus(APP_STATES.processing);
    handleFindProduct();
  }, [imgSrc]);

  const handleFlipSource = useCallback(() => {
    if (source === "environment") {
      setSource("user");
    } else {
      setSource("environment");
    }
  }, [source]);

  const handleCapture = useCallback(
    (e) => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
    },
    [webcamRef, setImgSrc]
  );

  const handleFindProduct = async () => {
    if (!imgSrc) {
      return;
    }

    try {
      setDescription("");
      const scanRes = await fetch(`/a/cart/scan`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          image: imgSrc.replace("data:image/jpeg;base64,", ""),
        }),
      });
      const data = await scanRes.json();

      if (!data || !data.description) {
        setStatus(APP_STATES.idle);
        return;
      }

      setStatus(APP_STATES.redirecting);

      const description = data.description;
      const labels = description.split("\n");

      console.log("🪄 Description");
      console.log(description);
      console.log(labels);

      setDescription(description);

      if (labels.includes("CACTUS") && labels.includes("ROSE")) {
        window.location.href =
          "https://orders-demo.myshopify.com/a/cart/g432593d84";
      } else if (labels.includes("BASIL")) {
        window.location.href =
          "https://orders-demo.myshopify.com/a/cart/97chbj426i";
      } else if (labels.includes("NATIVE")) {
        window.location.href =
          "https://orders-demo.myshopify.com/a/cart/45eef0a2f9";
      } else if (labels.includes("RUNGUM") && labels.includes("BUBBLEGUM")) {
        window.location.href =
          "https://orders-demo.myshopify.com/a/cart/3205c9b7ab";
      } else {
        setStatus(APP_STATES.idle);
      }

      return;
    } catch (e) {
      console.warn(e);
      setStatus(APP_STATES.idle);
    }
  };

  if (status === APP_STATES.redirecting) {
    return (
      <div className="w-full lg:max-w-lg h-full p-10">
        <div className="bg-white rounded-lg p-10">
          <div className="flex gap-2 items-center">
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-base font-medium">Redirecting to checkout...</p>
          </div>
          <p>{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:max-w-lg h-full min-h-screen p-10">
      <div className="bg-white rounded-lg p-10 h-full">
        <div className="border rounded-lg mb-2 bg-gray-100 overflow-hidden h-[50%]">
          <Webcam
            videoConstraints={videoConstraints}
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
          />
        </div>
        {status !== APP_STATES.processing ? (
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-block bg-slate-200 px-5 py-2 rounded-lg hover:bg-slate-300 w-full"
              onClick={handleCapture}
            >
              Scan product
            </button>
            <button
              type="button"
              onClick={handleFlipSource}
              className="bg-white border rounded-lg px-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>
          </div>
        ) : null}

        {status === APP_STATES.processing ? (
          <div className="flex gap-2 items-center">
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <div>Finding product...</div>
          </div>
        ) : null}

        <p>{description}</p>
      </div>
    </div>
  );

  return (
    <LocaleProvider
      defaultTranslations={defaultTranslations}
      locale={languageCode}
    >
      <ShopProvider shop={shop}>
        <Webcam />
      </ShopProvider>
    </LocaleProvider>
  );
}

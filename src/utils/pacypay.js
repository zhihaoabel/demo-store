class PacypayCheckout {
    constructor(transactionId, options = {}) {
        if (!transactionId) {
            throw new Error("Pacypay -> transactionId is null!");
        }

        this.container = options.container || "pacypay_checkout";
        this.onPaymentCompleted = options.onPaymentCompleted;
        this.onError = options.onError;
        this.onFinished = options.onFinished;

        this.handleMessage = this.handleMessage.bind(this);

        this._initContainerHeight = 0;
        this.createCheckout(options, transactionId);
    }

    static get version() {
        return "1.0.5";
    }

    createCheckout(options, transactionId) {
        let config = {};
        try {
            config = this.checkMerchant(options.environment);
            const containerElement = document.getElementById(this.container);
            this._initContainerHeight = containerElement.scrollHeight;

            const iframeElement = this.createIframe(config.iframeUrl);
            containerElement.innerHTML = "";
            containerElement.appendChild(iframeElement);

            window.removeEventListener("message", this.handleMessage, true);
            window.addEventListener("message", this.handleMessage, true);

            iframeElement.onload = () => {
                if (options.config) {
                    options.config.subProductType
                        ? (options.config.paymentMethod = options.config.subProductType)
                        : (options.config.paymentMethod = "card");

                    options.config.checkoutTheme ||
                    (options.config.checkoutTheme = "light");
                    options.config.showPayButton =
                        typeof options.config.showPayButton !== "boolean" ||
                        !!options.config.showPayButton;
                    options.config.buttonSeparation =
                        typeof options.config.buttonSeparation !== "boolean" ||
                        !!options.config.buttonSeparation;
                    options.config.displayBillingInformation =
                        typeof options.config.displayBillingInformation !== "boolean" ||
                        !!options.config.displayBillingInformation;

                    options.config.locale = options.locale;
                } else {
                    options.config = {
                        paymentMethod: "card",
                        checkoutTheme: "light",
                        showPayButton: true,
                        buttonSeparation: true,
                        displayBillingInformation: true,
                        locale: options.locale,
                    };
                }

                options.config.transactionId = transactionId;
                options.config.originUrl = window.location.origin;

                this.postMessage("pacypay_theme", JSON.stringify(options.config));
            };
        } catch (error) {
            this.onError && this.onError(error);
        }
    }

    checkMerchant(environment) {
        return {iframeUrl: this.getIframeUrl(environment)};
    }

    submit(data = {}) {
        this.postMessage("pacypay_checkout_submit", data);
    }

    onChangeWH(data) {
        const height = JSON.parse(data).height;
        const newHeight =
            this._initContainerHeight < height ? height : this._initContainerHeight;

        document.getElementById(this.container).style.height = `${newHeight}px`;
    }

    getIframeUrl(environment) {
        const urls = {
            sandbox: "https://sandbox-v3-checkout-sdk.pacypay.com",
            production: "https://v3-checkout-sdk.pacypay.com",
        };
        return urls[environment.toLowerCase()] || urls.sandbox;
    }

    createIframe(src) {
        const title = "pacypay iframe";
        const policy = "origin";
        const styleStr = "border: none; height:100%; width:100%; overflow:hidden;";

        const iframe = document.createElement("iframe");
        iframe.setAttribute("src", src);
        iframe.setAttribute("class", "pacypay-iframe");

        if (title === "" || title.trim().length === 0 || title.toLowerCase() === "none") {
            iframe.setAttribute("role", "presentation");
        } else {
            iframe.setAttribute("title", title);
        }

        iframe.setAttribute("allowtransparency", "true");
        iframe.setAttribute("style", styleStr);
        iframe.setAttribute("referrerpolicy", policy);
        iframe.setAttribute("scrolling", "no");

        const textNode = document.createTextNode("<p>Your browser does not support iframes.</p>");
        iframe.appendChild(textNode);

        return iframe;
    }

    handleMessage(event) {
        const {data} = event;
        const {action, data: eventData} = data || {};

        switch (action) {
            case "pacypay_checkout_success":
                this.onPaymentCompleted && this.onPaymentCompleted(JSON.parse(eventData));
                this.onFinished && this.onFinished(eventData);
                break;
            case "pacypay_checkout_error":
                this.onError && this.onError(eventData);
                this.onFinished && this.onFinished(eventData);
                break;
            case "pacypay_checkout_wh":
                this.onChangeWH && this.onChangeWH(eventData);
                break;
        }
    }

    postMessage(action, data) {
        const a = document.querySelector("iframe.pacypay-iframe");
        a && a.contentWindow.postMessage({action, data}, "*");
        a && a.parentNode.setAttribute("style", "height: 450px");
    }
}

export default PacypayCheckout;
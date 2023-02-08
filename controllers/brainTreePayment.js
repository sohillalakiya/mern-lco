const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "693m88qph69qrwzh",
    publicKey: "sqk62jt9gbfydc2t",
    privateKey: "d77e953b026e5936cdeb55ceedc483f9"
});

exports.getToken = (req, res) => {
    gateway.clientToken.generate({}, function (err, response) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.send(response);
        }
    })
}

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;

    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
            submitForSettlement: true
        }
    }, function (err, result) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.send(result);
        }
    });

}
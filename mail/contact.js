/**
 * İletişim formu — Web3Forms (https://web3forms.com)
 *
 * Access key index.html içindeki gizli input'ta tutulur.
 * Key henüz ayarlanmadıysa form, alanları doldurulmuş bir
 * e-posta taslağı açarak yine de çalışır.
 */
(function () {
    "use strict";

    var PLACEHOLDER = "WEB3FORMS_ACCESS_KEY_BURAYA";
    var MAILTO = "tahafurkanbademci@gmail.com";

    var form = document.getElementById("contactForm");
    var status = document.getElementById("formStatus");
    var button = document.getElementById("sendMessageButton");
    if (!form || !status || !button) return;

    function notify(type, text) {
        status.innerHTML =
            '<div class="alert alert-' + type + '" role="alert">' + text + "</div>";
    }

    function fallbackToMail(data) {
        var body =
            "İsim: " + data.get("name") + "\n" +
            "E-posta: " + data.get("email") + "\n\n" +
            data.get("message");
        window.location.href =
            "mailto:" + MAILTO +
            "?subject=" + encodeURIComponent(data.get("user_subject") || "") +
            "&body=" + encodeURIComponent(body);
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var data = new FormData(form);

        if (data.get("access_key") === PLACEHOLDER) {
            notify("info", "E-posta uygulaman açılıyor…");
            fallbackToMail(data);
            return;
        }

        button.disabled = true;
        status.innerHTML = "";

        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { Accept: "application/json" },
            body: data
        })
            .then(function (response) {
                return response.json().then(function (result) {
                    return { ok: response.ok, result: result };
                });
            })
            .then(function (payload) {
                if (payload.ok) {
                    notify("success", "<strong>Mesajın gönderildi.</strong> En kısa sürede dönüş yapacağım.");
                    form.reset();
                } else {
                    throw new Error(payload.result.message || "Gönderilemedi");
                }
            })
            .catch(function () {
                notify(
                    "danger",
                    "Mesaj gönderilemedi. Doğrudan " +
                        '<a href="mailto:' + MAILTO + '">' + MAILTO + "</a> adresine yazabilirsin."
                );
            })
            .then(function () {
                button.disabled = false;
            });
    });

    form.addEventListener("input", function () {
        status.innerHTML = "";
    });
})();

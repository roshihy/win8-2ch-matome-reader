// 空白のテンプレートの概要については、次のドキュメントを参照してください:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: このアプリケーションは新しく起動しました。ここでアプリケーションを
                // 初期化します。
            } else {
                // TODO: このアプリケーションは中断状態から再度アクティブ化されました。
                // ここでアプリケーションの状態を復元します。
                var outputValue = WinJS.Application.sessionState.greetingOutput;
                if (outputValue) {
                    var greetingOutput = document.getElementById("greetingOutput");
                    greetingOutput.innerText = outputValue;
                }
            }
            args.setPromise(WinJS.UI.processAll().then(function completed(){

                // Retrieve the div that hosts the Rating control.
                var ratingControlDiv = document.getElementById("ratingControlDiv");
                var ratingControl = ratingControlDiv.winControl;
                ratingControl.addEventListener("change", ratingChanged, false);

                var helloButton = document.getElementById("helloButton");
                helloButton.addEventListener("click", buttonClickHandler, false);

                // Retrieve the input element and register our
                // event handler.
                var nameInput = document.getElementById("nameInput");
                nameInput.addEventListener("change", nameInputChanged);


                // Restore app data. 
                var roamingSettings = Windows.Storage.ApplicationData.current.roamingSettings;

                // Restore the user name.
                var userName =
                    Windows.Storage.ApplicationData.current.roamingSettings.values["userName"];
                if (userName) {
                    nameInput.value = userName;
                }

                // Restore the rating. 
                var greetingRating = roamingSettings.values["greetingRating"];
                if (greetingRating) {
                    ratingControl.userRating = greetingRating;
                    var ratingOutput = document.getElementById("ratingOutput");
                    ratingOutput.innerText = greetingRating;
                }
            }));

        }
    };

    app.oncheckpoint = function (args) {
        // TODO: このアプリケーションは中断しようとしています。ここで中断中に
        // 維持する必要のある状態を保存します。中断中に自動的に保存され、
        // 復元される WinJS.Application.sessionState オブジェクトを使用
        // できます。アプリケーションを中断する前に非同期操作を完了する
        // 必要がある場合は、args.setPromise() を呼び出して
        // ください。
    };

    function ratingChanged(eventInfo) {

        var ratingOutput = document.getElementById("ratingOutput");
        ratingOutput.innerText = eventInfo.detail.tentativeRating;

        // Store the rating for multiple sessions.
        var appData = Windows.Storage.ApplicationData.current;
        var roamingSettings = appData.roamingSettings;
        roamingSettings.values["greetingRating"] = eventInfo.detail.tentativeRating;
    }

    function buttonClickHandler(eventInfo) {
        var userName = document.getElementById("nameInput").value;
        var greetingString = "Hello, " + userName + "!";
        document.getElementById("greetingOutput").innerText = greetingString;

        // Save the session data. 
        WinJS.Application.sessionState.greetingOutput = greetingString;
    }

    function nameInputChanged(eventInfo) {
        var nameInput = eventInfo.srcElement;

        // Store the user's name for multiple sessions.
        var appData = Windows.Storage.ApplicationData.current;
        var roamingSettings = appData.roamingSettings;
        roamingSettings.values["userName"] = nameInput.value;

    }

    app.start();
})();

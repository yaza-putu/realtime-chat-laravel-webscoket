document.addEventListener("DOMContentLoaded", function() {
    // get history
    getHistory();

    // add contact

    document.querySelectorAll(".add-chat").forEach(function (el) {
        el.addEventListener("click", function () {
            let userId = el.getAttribute("data-id");
            let url = document.querySelector("#getroom-url").value;
                url = url.replace(":user_id", userId);

            axios.get(url)
                .then(function (res) {
                    let data = res.data.data;
                    Echo.join(`chat.${data.room_id}`)
                        .here((users) => {
                            document.querySelector(".chat-title").innerHTML = data.user.name
                            loadingMessage(data.room_id, data.me)

                            var input = document.querySelector(".input-message");
                            var chatBody = document.querySelector(".chat-body");

                            if (input && chatBody) {
                                // first load message
                                chatBody.scrollTo({ left: 0, top: chatBody.scrollHeight});
                                // event when enter trigger
                                input.addEventListener("keypress", function (e) {
                                    if (e.key == "Enter") {
                                        let saveUrl = document.querySelector("#save-url").value;
                                        let formData = new FormData();
                                        formData.append("message", input.value)
                                        formData.append("room_id", data.room_id)

                                        axios.post(saveUrl, formData)
                                            .then(function (res) {
                                                chatBody.insertAdjacentHTML("beforeend", genMessage(input.value))
                                                input.value = ""
                                                chatBody.scrollTo({ left: 0, top: chatBody.scrollHeight, behavior: "smooth" });
                                            })
                                            .catch(function (res) {
                                                mdtoast.error(res.response.data.message);
                                            });
                                    }
                                });
                            }
                        })
                        .listen('SendMessage', (e) => {
                            console.log(e)
                            if (e.user_id !== data.me) {
                                handelMessageEvent(e.message);
                            }
                        })
                        .joining((user) => {
                            console.log(user.name);
                        })
                        .leaving((user) => {
                            console.log(user.name);
                        })
                        .error((error) => {
                            showhideChatBox(false)
                            console.error(error.error);
                        });
                })
                .catch(function (res) {
                    mdtoast.error(res.response.data.message)
                });
        })
    });
});



function genMessage(message) {
    let el = '<div class="flex flex-row justify-end mt-2 mb-2">\n' +
        '                        <div class="messages text-sm text-white grid grid-flow-row gap-2">\n' +
        '                            <div class="flex items-center flex-row-reverse group">\n' +
        '                                <p class="px-6 py-3 rounded-t-full rounded-l-full bg-blue-700 max-w-xs lg:max-w-md">'+message+'</p>\n' +
        '                                <button type="button" class="option-message">\n' +
        '                                    <svg viewBox="0 0 20 20" class="w-full h-full fill-current">\n' +
        '                                        <path d="M10.001,7.8C8.786,7.8,7.8,8.785,7.8,10s0.986,2.2,2.201,2.2S12.2,11.215,12.2,10S11.216,7.8,10.001,7.8z\n' +
        '\t M3.001,7.8C1.786,7.8,0.8,8.785,0.8,10s0.986,2.2,2.201,2.2S5.2,11.214,5.2,10S4.216,7.8,3.001,7.8z M17.001,7.8\n' +
        '\tC15.786,7.8,14.8,8.785,14.8,10s0.986,2.2,2.201,2.2S19.2,11.215,19.2,10S18.216,7.8,17.001,7.8z"></path>\n' +
        '                                    </svg>\n' +
        '                                </button>\n' +
        '                                <button type="button" class="option-message">\n' +
        '                                    <svg viewBox="0 0 20 20" class="w-full h-full fill-current">\n' +
        '                                        <path d="M19,16.685c0,0-2.225-9.732-11-9.732V2.969L1,9.542l7,6.69v-4.357C12.763,11.874,16.516,12.296,19,16.685z"></path>\n' +
        '                                    </svg>\n' +
        '                                </button>\n' +
        '                                <button type="button" class="option-message">\n' +
        '                                    <svg viewBox="0 0 24 24" class="w-full h-full fill-current">\n' +
        '                                        <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-3.54-4.46a1 1 0 0 1 1.42-1.42 3 3 0 0 0 4.24 0 1 1 0 0 1 1.42 1.42 5 5 0 0 1-7.08 0zM9 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm6 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path>\n' +
        '                                    </svg>\n' +
        '                                </button>\n' +
        '                            </div>\n' +
        '                            \n' +
        '                            \n' +
        '                            \n' +
        '                        </div>\n' +
        '                    </div>';
    return el;
}

function fetchLoadingMessage(active) {
    let el = ' <div class="loading-message absolute inset-0 flex items-center justify-center">\n' +
        '                        <button disabled type="button" class="bg-gray-300 p-2 flex py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center">\n' +
        '                            <svg aria-hidden="true" role="status" class="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>\n' +
        '                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>\n' +
        '                            </svg>\n' +
        '                            Loading...\n' +
        '                        </button>\n' +
        '                    </div>';

    if (active == true) {
        document.querySelector(".chat-body").insertAdjacentHTML("afterbegin", el)
    } else {
        var loadingMessageEl =  document.querySelector(".loading-message");
        if(loadingMessageEl) {
            loadingMessageEl.remove()
        }
    }
}

function getHistory() {
    let url = document.getElementById("histories-url").value;

    loading(".contacts", true)
    axios.get(url)
        .then(function (res) {
            let response = res.data.data;
            if (response.length < 1) {
                document.querySelector(".contacts").innerHTML = "<p class='text-gray-500 text-center'>Tidak memiliki pesan</p>";
                return ;
            }

            let html = "";
            response.forEach(function (value) {
                html += ' <div class="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg relative">\n' +
                    '                        <div class="w-16 h-16 relative flex flex-shrink-0">\n' +
                    '                            <img class="shadow-md rounded-full w-full h-full object-cover"\n' +
                    '                                 src="https://randomuser.me/api/portraits/men/1.jpg"\n' +
                    '                                 alt=""\n' +
                    '                            />\n' +
                    '                            <div class="absolute bg-gray-900 p-1 rounded-full bottom-0 right-0">\n' +
                    '                                <div class="bg-green-500 rounded-full w-3 h-3"></div>\n' +
                    '                            </div>\n' +
                    '                        </div>\n' +
                    '                        <div class="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">\n' +
                    '                            <p class="font-bold">'+ value.user.name +'</p>\n' +
                    '                            <div class="flex items-center text-sm font-bold">\n' +
                    '                                <div class="min-w-0">\n' +
                    '                                    <p class="truncate">'+ value.message +'</p>\n' +
                    '                                </div>\n' +
                    '                            </div>\n' +
                    '                        </div>\n' +
                    '                    </div>';
            });

            document.querySelector(".contacts").innerHTML = html;

        }).finally(function (res) {
            loading(".contacts", false)
        });
}


function loading(selector, active) {
    var el = document.querySelector(selector);
    if(active == true) {
        el.innerHTML = "<p class='text-gray-500 text-center loading'>Loading...</p>"
    } else {
        var loading = document.querySelector(".loading");
        if(loading) {
            loading.remove();
        }
    }
}

function showhideChatBox(active) {
    document.querySelectorAll(".chat").forEach(function (el) {
        if(active == true) {
            el.classList.remove("hidden");
        } else {
            el.classList.add("hidden");
        }
    });
}

function loadingMessage(room_id, me) {
    let url = document.querySelector("#conversation-url").value;
        url = url.replace(":room_id", room_id);
    fetchLoadingMessage(true)
    axios.get(url)
        .then(function (res) {
            let data = res.data.data;
            var chatBody = document.querySelector(".chat-body");
           if(data.length > 0) {
               data.forEach(function (value) {
                   if (value.user_id == me) {
                       let righMessage = '<div class="flex flex-row justify-end mt-2 mb-2">\n' +
                           '                        <div class="messages text-sm text-white grid grid-flow-row gap-2">\n' +
                           '                            <div class="flex items-center flex-row-reverse group">\n' +
                           '                                <p class="px-6 py-3 rounded-t-full rounded-l-full bg-blue-700 max-w-xs lg:max-w-md">'+ value.message +'</p>\n' +
                           '                                <button type="button" class="option-message">\n' +
                           '                                    <svg viewBox="0 0 20 20" class="w-full h-full fill-current">\n' +
                           '                                        <path d="M10.001,7.8C8.786,7.8,7.8,8.785,7.8,10s0.986,2.2,2.201,2.2S12.2,11.215,12.2,10S11.216,7.8,10.001,7.8z\n' +
                           '\t M3.001,7.8C1.786,7.8,0.8,8.785,0.8,10s0.986,2.2,2.201,2.2S5.2,11.214,5.2,10S4.216,7.8,3.001,7.8z M17.001,7.8\n' +
                           '\tC15.786,7.8,14.8,8.785,14.8,10s0.986,2.2,2.201,2.2S19.2,11.215,19.2,10S18.216,7.8,17.001,7.8z"></path>\n' +
                           '                                    </svg>\n' +
                           '                                </button>\n' +
                           '                                <button type="button" class="option-message">\n' +
                           '                                    <svg viewBox="0 0 20 20" class="w-full h-full fill-current">\n' +
                           '                                        <path d="M19,16.685c0,0-2.225-9.732-11-9.732V2.969L1,9.542l7,6.69v-4.357C12.763,11.874,16.516,12.296,19,16.685z"></path>\n' +
                           '                                    </svg>\n' +
                           '                                </button>\n' +
                           '                                <button type="button" class="option-message">\n' +
                           '                                    <svg viewBox="0 0 24 24" class="w-full h-full fill-current">\n' +
                           '                                        <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-3.54-4.46a1 1 0 0 1 1.42-1.42 3 3 0 0 0 4.24 0 1 1 0 0 1 1.42 1.42 5 5 0 0 1-7.08 0zM9 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm6 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path>\n' +
                           '                                    </svg>\n' +
                           '                                </button>\n' +
                           '                            </div>\n' +
                           '                        </div>\n' +
                           '                    </div>';

                       document.querySelector(".chat-body").insertAdjacentHTML("beforeend", righMessage)
                   } else {
                       let leftMessage = '<div class="flex flex-row justify-start mt-2 mb-2">\n' +
                           '                        <div class="messages text-sm text-gray-700 grid grid-flow-row gap-2">\n' +
                           '                            <div class="flex items-center group">\n' +
                           '                                <p class="px-6 py-3 rounded-t-full rounded-r-full bg-gray-800 max-w-xs lg:max-w-md text-gray-200">'+ value.message +'</p>\n' +
                           '                                <button type="button" class="option-message">\n' +
                           '                                    <svg viewBox="0 0 20 20" class="w-full h-full fill-current">\n' +
                           '                                        <path d="M10.001,7.8C8.786,7.8,7.8,8.785,7.8,10s0.986,2.2,2.201,2.2S12.2,11.215,12.2,10S11.216,7.8,10.001,7.8z\n' +
                           ' M3.001,7.8C1.786,7.8,0.8,8.785,0.8,10s0.986,2.2,2.201,2.2S5.2,11.214,5.2,10S4.216,7.8,3.001,7.8z M17.001,7.8\n' +
                           'C15.786,7.8,14.8,8.785,14.8,10s0.986,2.2,2.201,2.2S19.2,11.215,19.2,10S18.216,7.8,17.001,7.8z"></path>\n' +
                           '                                    </svg>\n' +
                           '                                </button>\n' +
                           '                                <button type="button" class="option-message">\n' +
                           '                                    <svg viewBox="0 0 20 20" class="w-full h-full fill-current">\n' +
                           '                                        <path d="M19,16.685c0,0-2.225-9.732-11-9.732V2.969L1,9.542l7,6.69v-4.357C12.763,11.874,16.516,12.296,19,16.685z"></path>\n' +
                           '                                    </svg>\n' +
                           '                                </button>\n' +
                           '                                <button type="button" class="option-message">\n' +
                           '                                    <svg viewBox="0 0 24 24" class="w-full h-full fill-current">\n' +
                           '                                        <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-3.54-4.46a1 1 0 0 1 1.42-1.42 3 3 0 0 0 4.24 0 1 1 0 0 1 1.42 1.42 5 5 0 0 1-7.08 0zM9 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm6 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path>\n' +
                           '                                    </svg>\n' +
                           '                                </button>\n' +
                           '                            </div>\n' +
                           '                        </div>\n' +
                           '                    </div>';
                       document.querySelector(".chat-body").insertAdjacentHTML("beforeend", leftMessage)
                   }
                   chatBody.scrollTo({ left: 0, top: chatBody.scrollHeight, behavior: "smooth" });

               });
           } else {
               document.querySelector(".chat-body").innerHTML = '<p class="text-gray-500 text-center">Tidak memiliki pesan</p>';
           }

        }).finally(function () {
            fetchLoadingMessage(false);
            showhideChatBox(true);
        });
}

function handelMessageEvent(message) {
    var chatBody = document.querySelector(".chat-body");
    let leftMessage = '<div class="flex flex-row justify-start mt-2 mb-2">\n' +
        '                        <div class="messages text-sm text-gray-700 grid grid-flow-row gap-2">\n' +
        '                            <div class="flex items-center group">\n' +
        '                                <p class="px-6 py-3 rounded-t-full rounded-r-full bg-gray-800 max-w-xs lg:max-w-md text-gray-200">'+ message +'</p>\n' +
        '                                <button type="button" class="option-message">\n' +
        '                                    <svg viewBox="0 0 20 20" class="w-full h-full fill-current">\n' +
        '                                        <path d="M10.001,7.8C8.786,7.8,7.8,8.785,7.8,10s0.986,2.2,2.201,2.2S12.2,11.215,12.2,10S11.216,7.8,10.001,7.8z\n' +
        ' M3.001,7.8C1.786,7.8,0.8,8.785,0.8,10s0.986,2.2,2.201,2.2S5.2,11.214,5.2,10S4.216,7.8,3.001,7.8z M17.001,7.8\n' +
        'C15.786,7.8,14.8,8.785,14.8,10s0.986,2.2,2.201,2.2S19.2,11.215,19.2,10S18.216,7.8,17.001,7.8z"></path>\n' +
        '                                    </svg>\n' +
        '                                </button>\n' +
        '                                <button type="button" class="option-message">\n' +
        '                                    <svg viewBox="0 0 20 20" class="w-full h-full fill-current">\n' +
        '                                        <path d="M19,16.685c0,0-2.225-9.732-11-9.732V2.969L1,9.542l7,6.69v-4.357C12.763,11.874,16.516,12.296,19,16.685z"></path>\n' +
        '                                    </svg>\n' +
        '                                </button>\n' +
        '                                <button type="button" class="option-message">\n' +
        '                                    <svg viewBox="0 0 24 24" class="w-full h-full fill-current">\n' +
        '                                        <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-3.54-4.46a1 1 0 0 1 1.42-1.42 3 3 0 0 0 4.24 0 1 1 0 0 1 1.42 1.42 5 5 0 0 1-7.08 0zM9 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm6 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path>\n' +
        '                                    </svg>\n' +
        '                                </button>\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '                    </div>';
    document.querySelector(".chat-body").insertAdjacentHTML("beforeend", leftMessage)
    chatBody.scrollTo({ left: 0, top: chatBody.scrollHeight, behavior: "smooth" });
}


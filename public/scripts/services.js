(($) => {

    const loaderHTML = `<div class="ui loader-wrapper">
        <div class="ui active dimmer">
        <div class="ui text loader">Loading</div>
        </div>
        <p></p>
    </div>`

    $.myservices = {
        debug: (msg) => {
            console.log('My Debug:', {...msg})
        },
        flashAmessage: flashAmessage,
        manipulateFormData,
        getFormData: ($form) => {
            var unindexed_array = $form.serializeArray();
            // var indexed_array = {};
            // $.map(unindexed_array, function(n, i){
            //     indexed_array[n['name']] = n['value'];
            // });
            let data = manipulateFormData(unindexed_array);
            return data
        },
        createModal: (event) => {
            event.preventDefault();
            let target = $(event.target)
            let href = target.attr('href') || target.attr('data-url')
            let modal = $('#common-modal').modal('setting', 'transition', 'horizontal flip')
            $.myservices.loaders.add()
            $.ajax({
                type: 'get',
                url: href+'/modal',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    // res = JSON.parse(response)
                    let html = response?.html
                    $('.loader-wrapper').toggle()
                    modal.empty().append('<i class="close icon"></i>');
                    $(html).appendTo(modal)
                    modal.modal('toggle');
                    // $.myservices.flashAmessage(response.flash_message)
                },
                error: function (error) {
                    $.myservices.flashAmessage({ ...error.responseJSON.flash_message })
                },
                complete: function () {
                    $.myservices.loaders.remove();
                }
            });
        },
        http: {
            get: ({ uri }) => {
                message = !message ? 'Θελετε να καταχωρησετε αυτη την εγγραφη!;' : message
                $.myservices.loaders.add();
                // if (confirm(message)) {
                    $.ajax({
                        type: 'get',
                        url: uri,
                        // beforeSend: function (xhr) {
                        //     xhr.setRequestHeader('Authorization', `Bearer ${userToken}`);
                        // },
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data: JSON.stringify(data),
                        success: function (response) {
                            $.myservices.loaders.remove();
                            $.myservices.flashAmessage({ ...response.flash_message })
                        },
                        error: function (error) {
                            $.myservices.flashAmessage({ ...error.responseJSON.flash_message })
                        },
                        complete: function () {
                            $.myservices.loaders.remove();
                        }
                    });
                // }
                // $.myservices.loaders.remove();
            },
            post: ({ uri, data, message, appendTo, clear }) => {
                message = !message ? 'Θελετε να καταχωρησετε αυτη την εγγραφη!;' : message
                $.myservices.loaders.add();
                if (confirm(message)) {
                    $.ajax({
                        type: 'post',
                        url: uri,
                        // beforeSend: function (xhr) {
                        //     xhr.setRequestHeader('Authorization', `Bearer ${userToken}`);
                        // },
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data: JSON.stringify(data),
                        success: function (response) {
                            $.myservices.loaders.remove();
                            $.myservices.flashAmessage({ ...response.flash_message })
                            if (appendTo) {
                                if(clear) $(appendTo).empty()
                                $(appendTo).append(response.html)
                            }
                        },
                        error: function (error) {
                            $.myservices.flashAmessage({ ...error.responseJSON.flash_message })

                        },
                        complete: function () {
                            $.myservices.loaders.remove();
                        }
                    });
                }
                $.myservices.loaders.remove();
            },
            put: ({ uri, data, message, appendTo, clear }) => {
                message = !message ? 'Θελετε να ενημερωσετε αυτη τη καταχωρηση;' : message
                $.myservices.loaders.add();
                if (confirm(message)) {
                    $.ajax({
                        type: 'put',
                        url: uri,
                        // beforeSend: function (xhr) {
                        //     xhr.setRequestHeader('Authorization', `Bearer ${userToken}`);
                        // },
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data: JSON.stringify(data),
                        success: function (response) {
                            $.myservices.flashAmessage({ ...response.flash_message })
                            if (appendTo) {
                                if(clear) $(appendTo).empty()
                                $(appendTo).append(response.html)
                            }
                        },
                        error: function (error) {
                            $.myservices.flashAmessage({ ...error.responseJSON.flash_message })

                        },
                        complete: function () {
                            $.myservices.loaders.remove();
                        }
                    });
                }
                $.myservices.loaders.remove();
            },
            delete: ({ uri, message, remove }) => {
                message = !message ? 'Θελετε να διαγραψετε αυτη τη καταχωρηση;' : message

                $.myservices.loaders.add();
                if (confirm(message)) {
                    $.ajax({
                        type: 'delete',
                        url: uri,
                        // beforeSend: function (xhr) {
                        //     xhr.setRequestHeader('Authorization', `Bearer ${userToken}`);
                        // },
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $.myservices.flashAmessage({ ...response.flash_message })
                            $(remove).remove()
                        },
                        error: function (error) {
                            $.myservices.flashAmessage({ ...error.responseJSON.flash_message })

                        },
                        complete: function () {
                            $.myservices.loaders.remove();
                        }
                    });
                }
                $.myservices.loaders.remove();
            }

        },
        validatePassword: (password, repassword) => {
            var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
            var pass = $(password).val()
            var repass = $(repassword).val()
            //if( (pass==="" && repass==="")||
            //     (pass!=="" && repass==="")||
            //     (pass==="" && repass!=="")){
            //     // $.scada.flashMessage('Password Error','Password could not be empty','#DB2828')
            //     $password.attr('disabled',"true")
            //     $repassword.attr('disabled',"true")
            //     return true;
            // }else 
            if ($(password).attr("disabled") || $(repassword).attr('disabled')) { return true }
            if (!pass.match(regex) || !repass.match(regex)) {
                $.myservices.flashAmessage('Password Advice', 'Password must be at least 8 characters long, one letter, one number', 'warning')
                $(password).parent().addClass('error')
                $(repassword).parent().addClass('error')
                $(password).attr('data-validate', "false")
                return false

            } else if (pass !== repass) {
                $.myservices.flashAmessage('Password Error', 'Password miss match try again!', 'error')
                $(password).parent().addClass('error')
                $(repassword).parent().addClass('error')
                $(password).attr('data-validate', "false")
                return false;
            } else if (pass === repass) {
                $.myservices.flashAmessage('New password match', 'Nice Job!', 'success')
                $(password).parent().removeClass('error')
                $(repassword).parent().removeClass('error')
                $(password).attr('data-validate', "true")
                return true;
            }
        },
        showPWD: function (e) {
            var inputField = $(e.target).siblings($('input[name="password"]'));
            let type = inputField.attr("type");
            if (type === 'password') {
                $(inputField).attr("type", "text");
            } else {
                $(inputField).attr("type", "password");
            }
        },
        toggleMenu: function (e) {
            let sidebar = $(e.target).attr('data-target')
            $(sidebar).toggleClass('side-open')
        },
        loginRequest: login,
        lockUnlockForm: toogleForm,
        loaders: {

            add: () => {
                $('body').append(loaderHTML);

            },
            remove: () => {
                $('.loader-wrapper').fadeOut("fast", function () {
                    $(this).remove();

                })

            }
        },
        redirectToPath: (path) => {
            path = path != undefined ? path : '/'
            destination = location.origin + path;
            location.replace(destination)
        },
        paginationWithParams: (e) => {
            e.preventDefault()
            let target = $(e.target)
            let page = target.attr('data-page')
            let limit = target.attr('data-limit')
            let searchParams = new URLSearchParams(window.location.search);
            searchParams.set('page', page)
            searchParams.set('limit', limit)
            window.location.search = searchParams.toString();
        },
        isDarkMode: (e) => {
            window.matchMedia('(prefers-color-scheme: dark)').addListener(function (e) {
                console.log(`changed to ${e.matches ? "dark" : "light"} mode`)
            });
        },
        toDateStringGR: toDateStringGR

    }


    function toogleForm(eventBtn, formElementId) {
        eventBtn.on('click', function () {
            formElementId.toggleClass('deactivate')
            $(this).toggleClass('primary')
        })
    }

    function login(username, password, rememberMe, uri) {
        $.myservices.loaders.add();
        
        $.ajax({
            type: 'post',
            url: uri,
            data: JSON.stringify({ username, password, rememberMe }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                console.log(response)
                $.myservices.loaders.remove();
                $.myservices.flashAmessage({ ...response.flash_message })
                $.myservices.redirectToPath(response?.path)
            },
            error: function (error) {
                console.log('Login error', error)
                $.myservices.loaders.remove();
                $.myservices.flashAmessage({ ...error.responseJSON.flash_message })
            }
        });
    }
    /**
     * @description Looping an array of objects and the keys with the same name pushing the values to single entry
     * @param {Array} array of objects
     * @returns 
     */
    function manipulateFormData(array) {
        let prev = ''
        let obj = {}
        for (let i = 0; i < array.length; i++) {
            let cur = array[i].name;
            if (prev === cur) {
                if (obj[cur] && !Array.isArray(obj[cur])) {
                    let val = obj[cur]
                    obj[cur] = []
                    obj[cur].push(val)
                }
                obj[cur].push(array[i].value)
            } else {
                prev = cur
                obj[cur] = array[i].value
            }
        }
        return obj
    }

    /**
     * 
     * @param {String} title Flash message head title 
     * @param {String} text Flash message body content 
     * @param {String} type <success | info | warning | error>
     * @param {String} icon Valid Semantic ui icon class name
     */
    function flashAmessage({ title, content, type, icon }) {
        // title += '<audio class="sound"></audio>'
        switch (type) {
            case "success":
                $.uiAlert({
                    textHead: title,
                    text: content,
                    bgcolor: '#19c3aa',
                    textcolor: '#fff',
                    position: 'top-right', // top And bottom ||  left / center / right
                    icon: icon || 'checkmark box',
                    time: 3
                });
                break;
            case "info":
                $.uiAlert({
                    textHead: title,
                    text: content,
                    bgcolor: '#1678C2',
                    textcolor: '#fff',
                    position: 'top-right', // top And bottom ||  left / center / right
                    icon: icon || 'eye',
                    time: 60
                });
                break;
            case "warning":
                $.uiAlert({
                    textHead: title,
                    text: content,
                    bgcolor: '#F26202',
                    textcolor: '#fff',
                    position: 'top-right', // top And bottom ||  left / center / right
                    icon: icon || 'exclamation',
                    time: 3
                });
                break;
            case "error":
                $.uiAlert({
                    textHead: title || '',
                    text: content || '',
                    bgcolor: '#D01919',
                    textcolor: '#fff',
                    position: 'top-right', // top And bottom ||  left / center / right
                    icon: icon || 'ban',
                    time: 3
                });
                break;
            default:
                $.uiAlert({
                    textHead: title,
                    text: content,
                    bgcolor: '#1678C2',
                    textcolor: '#fff',
                    position: 'top-right', // top And bottom ||  left / center / right
                    icon: icon || 'eye',
                    time: 3
                });
        }
    }

    // Manipulate Dates to GR
    const DATES = {
        Days: ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'],
        days: ['Κυρ', 'Δευτ', 'Τρί', 'Τετ', 'Πέμ', 'Παρ', 'Σάβ'],
        Months: ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απριλιος', 'Μάϊος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'],
        months: ['Ιαν', 'Φεβ', 'Μάρ', 'Απρ', 'Μάϊ', 'Ιούν', 'Ιούλ', 'Αύγ', 'Σεπ', 'Οκτ', 'Νοέμ', 'Δεκ']
    }

    function toDateStringGR(localeDateString) {
        let [day, month, year] = localeDateString.split('/')

        return `${DATES.Days[day]} ${DATES.Months[month]} ${day} ${year}`
    }


    // 

})(jQuery);


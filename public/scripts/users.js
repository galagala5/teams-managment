
$('.ui.accordion').accordion();

let $newUserFormEl = $('#new-user-form')

// submit new user form
$('#add-new-user').on('click',function(event){
    event.preventDefault();
    let isValid = $newUserFormEl.form('is valid')
    if (isValid) {
        const newUser = $newUserFormEl.serializeJSON()

        $.myservices.http.delete({
            uri: `/users/${userId}`,
            data:newUser,
            message:'Θελετε να καταχωρήσετε τον νεω χρήστη?',
            appendTo:'.users-table tbody'
        })
    }
})

//delete user by id
$('.delete-user').on('click',function(e){
    let userId = $(e.target).closest('tr').attr('data-id')
    $.myservices.http.delete({
        uri: `/users/${userId}`,
        message:'Θελετε να διαγραψετε τον χρήστη?',
        remove:`.users-table tbody tr[data-id=${userId}]`
    })
})

function resetPassword(e){
    e.preventDefault()
    let url = $(e.target).attr('href')
    $.myservices.http.get({uri:url})
}

function update(e){
    e.preventDefault();
    let target = $(e.target)
    let forrmEl = target.closest('form')
    let userId = target.attr('data-id')
    let user = forrmEl.serializeJSON()

    let dataUrl = target.attr('data-url')
    let url = dataUrl || `/users/${userId}/update`
    user.id = userId
    user.active = !user?.active ? "false":"true" 
    console.log(user,url)
    $.myservices.http.put({
      uri: url,
      data: user,
    })
}

function updateProfile(e){
    e.preventDefault();
    let target = $(e.target)
    let forrmEl = target.closest('form')
    let userId = target.attr('data-id')
    let user = forrmEl.serializeJSON()
    let dataUrl = target.attr('data-url')
    let url = dataUrl || `/users/${userId}/update`
    user.id = userId
    console.log(user,url)
    $.myservices.http.put({
      uri: url,
      data: user,
    })
}

$('.activate-user').on('click',function(e){
    e.preventDefault();
    let userId = $(e.target).closest('tr').attr('data-id')
    $.myservices.http.put({
      uri: `/users/${userId}/activate`,
      message:"Θελετε να επαναφέρεται τον χρήστη?"
    })
})


$newUserFormEl.form({
    on: 'blur',
    fields: {
        username: 'empty',
        firstname: 'empty',
        lastname: 'empty',
        email: 'email',
        role: 'number',
        password: ['minLength[6]', 'empty'],
        match: {
            identifier: 'repassword',
            rules: [
                {
                    type: 'match[password]',
                    prompt: 'Please put the same value in both fields'
                }
            ]
        },
        active: 'checked'
    }
});
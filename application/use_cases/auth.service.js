
class AuthServices{ 
    constructor({
        UserPersistence,
        ContactsPersistence,
        jsonwebtoken,
        Bcrypt,
        config


    }){
        this.User = UserPersistence
        this.Contact = ContactsPersistence;
        this.Jwt = jsonwebtoken
        this.Bcrypt = Bcrypt
        // app config 
        this.config = config
    }
    /**
     * @name loginUser
     * @param {*} param0 
     * @returns 
     */
    async loginUser({username,password}){
        try {
            let _user = await this.User.getByUsername(username,true)
            _user = _user[0]
            console.log(_user.password,password)
            if(!_user || _user.deleted){ throw new Error('User not found') }
            if(!_user.active){ throw new Error('You account has been suspended!')}
            let isValid = await this.comparePassword(password,_user.password)
            let token = this.Jwt.sign({
                id:_user.id,
                username:_user.username,
                role:_user.role,
            })
            
            return {token,username}
        } catch (error) {
            throw Error(error) 
        }
    }

    logOutUser({id}){
        
    }
    
    async getUsers({deleted}){
        try {
            if(deleted){
                return await this.User.getAll()
            }
            return await this.User.getActive()
        } catch (error) {
            throw new Error(error)
        }
    }

    /**
     * 
     * @param {*} param0 
     * @returns 
     */
    async getUserById({id}){
        try {
            let users = await this.User.getById(id)
            return users
        } catch (error) {
            throw new Error(error)
        }
    }

    async registerUser(data){
        try {
            // validate new user data 
            data.active = data.active ==='on'?true:false
            delete data?.repassword
            data.password = this.Bcrypt.hashSync(data.password,10)
            let newUser = await this.User.add(data)
            return newUser
        } catch (error) {
            throw new Error(error)
        }
    }

    async resetPasswordById({id}){
        try {

            let password = this.Bcrypt.hashSync( this.config.DEFAULT_USER_PASSWORD ,10)
            let user = await this.User.updateById(id,{password})
            return user
        } catch (error) {
            throw new Error(error)
        }
    }
    /**
     * 
     * @param {String} id User Id to be update 
     * @param {String} data User data to be update 
     * @param {Boolean} password Flag to update password also
     * @returns 
     */
    async updateUserById({id,data,password}){
        try {
            password = password || false;
            if(password){
                if(!data['password'] && data['password'] !== undefined || data['password'] ==='' ){ 
                    delete data['password'];
                    delete data['password']
                }else{
                    data.password = this.Bcrypt.hashSync( data.password ,10)
                }
            }else{
                delete data?.password
                delete data?.repassword
            }
            // user role can be changed only from higher level user
            let user = await this.User.updateById(id,data)
            return user
        } catch (error) {
            throw new Error(error)
        }
    }


    async activateUser({id}){
        try {
            let user = await this.User.activate(id)
            return user
        } catch (error) {
            throw new Error(error)
        }
    }

    async updateUserRole({id},{role}){}
    
    async updateUserAccountStatus({id},{account}){}

    async deleteUserById({id}){
        try {
            let user = await this.User.delete(id)
            return user
        } catch (error) {
            throw new Error(error)
        }
    }

    cookieOptions() {
        return{
            // maxAge: 1000 * 60 * 30, // would expire after 15 minutes
            httpOnly: true, // The cookie only accessible by the web server
            path:'/',
            secure:false
        }
    }
    
    /**
     * 
     * @param {*} res Express request object
     * @param {*} cookie Cookie name
     * @param {*} value value of the cookie
     */
    setCookie(res,cookie="",value=""){
        res.cookie(cookie,`${value}`, this.cookieOptions())
    }
    /**
     * 
     * @param {*} res express req object
     * @param {*} cookie The name of the cookie to be destriyed
     */
    async destroyeCookie(res,cookie){
        res.cookie(cookie,` `,{ maxAge:0,path:'/'})
    }

    /**
     * @private
     */
    comparePassword(plain,hashed){
        return new Promise((resolve,reject)=>{
            let isValid = this.Bcrypt.compareSync( plain ,hashed)
            if(isValid){ resolve (true); }
            else{ reject(new Error('Invalid username or password!'))}
        })
    }


}

module.exports = AuthServices
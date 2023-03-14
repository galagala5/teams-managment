class TrainningPresents{
    constructor(){
        this.progressEl = "#progress"  
    }

    get presentsFromLS(){
        return JSON.parse(window.localStorage.getItem("presents"))
    }
    
    get playersFromLS(){ 
        return JSON.parse(window.localStorage.getItem("players") )
    }
    
    add(player){
        if(!player){return}
        let _presents = this.presentsFromLS;
        let index = _presents.players.indexOf(player);
        if (index !== -1) return;
        _presents.players.push(player)
        _presents.rate = this.rate(_presents)
        this.progressUpdate(_presents.rate)
        this.save('presents',_presents)
        return true
    }

    remove(player){
        if(!player){return}
        let _presents = this.presentsFromLS;
        let index = _presents.players.indexOf(player);
        if (index !== -1) _presents.players.splice(index, 1);
        _presents.rate = this.rate(_presents)
        this.progressUpdate(_presents.rate)
        this.save('presents',_presents)
        return true
    }
    rate(_presents){

        let total = this.playersFromLS;
        let step = 100/total.length
        _presents.rate = Math.round( _presents.players.length * step );
        return _presents.rate
    }

    restore(){
        
        let _players = this.playersFromLS
        let _presents = this.presentsFromLS;
        if(typeof _presents==='undefined' || _presents===null){
            _presents = {coach:'',players:[],rate:0,teamId:"" }
            this.save('presents',_presents)
        }else{
            _presents.players.forEach(player => {
                let p = $(`[data-id=${player}]`)
                p.addClass('active')
                p.attr('data-present',true)
            });
        }
        this.progressUpdate(_presents.rate)
    }

    saveSession(){
        console.log('...save')
        let _presences = this.presentsFromLS
        let team = $('#team option:selected').val()
        let coach = $('#coach option:selected').val()
        let date = $('input[name="date"]').val()
        let flag , teamF, coachF,dateF = false;
        if(team==''){ $('#team').parent('div').addClass('error') }else{ $('#team').parent('div').removeClass('error'); teamF=true;}; 
        if(coach==''){ $('#coach').parent('div').addClass('error') }else{ $('#team').parent('div').removeClass('error'); coachF=true; }
        if(date==''){ $('input[name="date"]').parent('div').addClass('error') }else{ $('input[name="date"]').parent('div').removeClass('error'); dateF=true}; 
        flag = teamF&coachF&dateF;
        _presences.team = team
        _presences.coach = coach
        _presences.date = date
        console.log(_presences)
        return _presences
    }
    submit(url){

        let presences = this.save()
        $.myservices.http.post({
            uri:`/presences/add`,
            data:presences,
            message:'Έχετε ολοκληρώσει τις παρουσίες!'
        })
    }

    present(event){
        let target = event.target
        let player = $(target).attr('data-id')
        let present = $(target).attr('data-present') ==="true"?'false':'true'
        if(present==="true"){ 
            this.add(player)
            $(target).addClass('active')
        }else if(present==='false'){
            this.remove(player)
            $(target).removeClass('active')
        }
        $(target).attr('data-present',present)
    }

    progressUpdate(precent){
        let progress = $(this.progressEl)
        precent = +precent.toFixed(2)
        let label = progress.children('.label')
        const defaultText = label.attr('data-label')
        let bar = progress.children('.bar')
        if(precent<=100){
            progress.attr('data-percent',precent)
            bar.css("width",`${precent}%`)
            label.empty();
            label.text(`${defaultText} ${precent}%`);
        }
        if(precent==100){
            label.empty();
            label.text('Οι παρουσίες ολοκληρώθηκαν 100%');
        }
    }

    clearCSS(){
        let button = $('.field-player button').toArray()
        if(!button.length){ return }

        button.forEach(el=>{$(el).removeClass("active")})
    }

    clearPresences(){ 
        this.clear("presents")
        this.clearCSS()
        this.progressUpdate(0)

    }

    save(name,json){window.localStorage.setItem(name,JSON.stringify(json))}
    clear(name){window.localStorage.removeItem(name)}
}



window.TrainningPresents = new TrainningPresents()

class CalcController {

    constructor(){
        
        // _ priva o atributo
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateCalcEl = document.querySelector("#data");
        this._timeCalcEl = document.querySelector("#hora");
        this._currentDate;
        

        this.initialize();
        this.initButtonEvents();
        this.initKeyBoard();

    }

    copyToClipBoard(){
    
        let input = document.createElement('input');

        input.value = this.getDisplayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand('Copy');

        input.remove();
    
    
    }

    pasteFromClipBoard(){
        
        document.addEventListener("paste", e => {

            let text = e.clipboardData.getData('Text');
            
            this.addOperation(text);
            this.setDisplayCalc = parseFloat(text);

        })
    }

    initialize(){

        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime();
            
        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipBoard();

        document.querySelectorAll('.btn-ac').forEach(btn =>{
            
            btn.addEventListener('dblclick', e => {
                
                this.toggleAudio();
            });
        });

    }

    toggleAudio(){

        this._audioOnOff = !this._audioOnOff;

    }

    playAudio(){

        if (this._audioOnOff){

            this._audio.currentTime = 0;
            this._audio.play();

        }
    }

    initKeyBoard(){
        document.addEventListener('keyup', e => {
            
            this.playAudio()

                switch (e.key) {
        
                    case 'Escape':
                        this.clearAll();
                        break;

                    case 'Backspace':
                        this.clearEntry();
                        break;

                    case '+':
                    case '-':
                    case '%':
                    case '*':
                    case '/':
                        this.addOperation(e.key);
                        break;

                    case 'Enter':
                    case '=':
                        this.calc();
                        break;

                    case '.':
                    case ',':
                        this.addDot();
                        break;

                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                        this.addOperation(parseInt(e.key));
                        break;

                    case 'c':
                        if (e.ctrlKey) this.copyToClipBoard();
                        break;
                }

        });
    }

    addEventListenerAll(element, events, fn) {

        events.split(' ').forEach(event => {
            
                element.addEventListener(event, fn, false);
            }); 
        }

    clearAll (){
        this._operation = [];
        this.setLastNumberToDisplay();
    }
    
    clearEntry (){
        this._operation.pop();
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();

    }

    setLastOperation(value){
        this._operation[this._operation.length -1] = value;
    }

    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }

    isOperator(value){
        return (['+', '-', '*', '%', '/' ].indexOf(value) > -1);
    }

    pushOperation(value){

        this._operation.push(value);

        if (this._operation.length > 3){

            this.calc();

        }
    }

    getResult(){

        try {
            
            return eval(this._operation.join(""));
            
        } catch (error) {
            setTimeout(() => {
                this.setError();
            }, 1);
        }
    }

    calc(){

        let last = '';
        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if(this._operation.length > 3){
            last = this._operation.pop();

            this._lastNumber = this.getResult();
        }else if(this._operation.length == 3){

            this._lastNumber = this.getLastItem(false);

        }

        let operator = this._operation[1];
        let result = this.getResult();

        if (last == '%'){

            switch(operator){

                case '+':
                    result = this._operation[0] + (this._operation[2] * this._operation[0] / 100);
                    this._operation = [result];
                    break;

                case '-':
                    result = this._operation[0] - (this._operation[2] * this._operation[0] / 100);
                    this._operation = [result]; 
                    break;

                case '/':
                    result = this._operation[0] / (this._operation[2] * this._operation[0] / 100);
                    this._operation = [result];
                    break;

                default:
                    result /= 100;
                    this._operation = [result];
                    
            }

        } else{
                
            this._operation = [result];
            
            if(last) this._operation.push(last);
        }
            this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true){

        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--){
            
            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            }
            
        }

        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this.lastNumber;
        }

        return lastItem;
    }

    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0;

        this.setDisplayCalc = lastNumber;
        
    }

    addOperation(value){

        if(isNaN(this.getLastOperation())){

            if(this.isOperator(value)){
                this.setLastOperation(value);
            }else{
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }

        }else{
            
            if(this.isOperator(value)){
                this.pushOperation(value);
            }else{
                
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation((newValue));

                this.setLastNumberToDisplay();
                
            }


        }

        console.log(this._operation);
    }

    addDot(){

        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation && lastOperation.split('').indexOf('.') > -1) return;

        if(this,this.isOperator(lastOperation) || !lastOperation) {
            
            this.pushOperation('0.');

        }else{
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();

    }

    setError() {
        this.setDisplayCalc = 'ERROR';
    }

    execBTN(value){

        this.playAudio()

        switch (value) {

            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'igual':
                this.calc();

                break;
            case 'ponto':
                this.addDot();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();    
        }
    }

    initButtonEvents(){

        let buttons = document.querySelectorAll("#buttons > g, #parts > g  ")

        buttons.forEach((bnt, index) => {

            this.addEventListenerAll(bnt, 'click drag', e => {

                let textBTN = console.log(bnt.className.baseVal.replace("btn-", ""));
                this.execBTN(bnt.className.baseVal.replace("btn-", ""));
                
            });

            this.addEventListenerAll(bnt, 'mouseover mouseup mousedown', e => {
                bnt.style.cursor = 'pointer';
            })

        });

    }

    setDisplayDateTime(){

        this.setDisplayDate = this.getDataAtual.toLocaleDateString(this._locale);
        this.setDisplayTime = this.getDataAtual.toLocaleTimeString(this._locale);
    }

    get getdDisplayTime(){
        return this._timeCalcEl.innerHTML;
    }

    set setDisplayTime(value){
        return this._timeCalcEl.innerHTML = value;
    }

    get getdDisplayDate(){
        return this._dateCalcEl.innerHTML;
    }

    set setDisplayDate(value){
        return this._dateCalcEl.innerHTML = value;
    }


    get getDisplayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set setDisplayCalc(valor){

        if (valor.toString.length > 10 ){
            this.setError();
        }
        this._displayCalcEl.innerHTML = valor;
    }

    get getDataAtual(){
        return new Date();
    }

    set setDataAtual(valor){
        this._currentDate = valor
    }
    
}
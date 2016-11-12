export class Test {
    controller(){
        this.name = "Parent";
    }
    view(){
        return(
            <h1>
                This is {this.name} Element 
            </h1>
        )
    }
}
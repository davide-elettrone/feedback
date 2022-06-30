import React from "react";

export default class ThankYouPage extends React.Component{
    componentDidMount(){
        document.title = 'Grazie!'
    }

    render(){
        return <div className="ThankYouPage">
            <h1>Grazie per la collaborazione!</h1>
        </div>
    }
}
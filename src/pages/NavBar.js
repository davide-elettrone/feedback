import React from "react";

export default class NavBar extends React.Component{
    render(){

        return <div className="NavBar">
            <div style={{width: this.getPositive()}}/>
        </div>
    }

    getPositive(){
        const percentage = 100 * (this.props.currentStep - 1) / (this.props.totalSteps - 1);
        if(percentage === 0) return 'var(--nav-bar-height)';
        return percentage + '%';
    }
}
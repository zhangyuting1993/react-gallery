import React, {PropTypes,Component} from 'react';

class ControllerComponent extends Component {  
  constructor(props) {
	    super(props)
  }


  handleClick(e){

      if(this.props.arrange.isCenter){
             this.props.inverse();
      }else{
            this.props.center();
      }
   
      e.stopPropagation();
      e.preventDefault();
  }
   
  render() {

     // var styleObj={}

     // if(this.props.arrange.pos){
     //    styleObj=this.props.arrange.pos;
     // }


     // if(this.props.arrange.rotate){
     //    (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
     //        styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
     //      }.bind(this));
     // }

     // if(this.props.arrange.isCenter){
     //        styleObj.zIndex=11;
     // }


    var controlelrUnitClassName = "controller-unit";

    if(this.props.arrange.isCenter){
       controlelrUnitClassName+=" is-center";

       if(this.props.arrange.isInverse){
           controlelrUnitClassName+= " is-inverse";
       }
    }





    return (

         <span className={controlelrUnitClassName} onClick={this.handleClick.bind(this)}></span>
    )
  }
}

ControllerComponent.PropTypes = {
}

export default ControllerComponent;
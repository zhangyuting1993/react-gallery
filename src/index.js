import React, { Component } from 'react';
import { render,findDOMNode } from 'react-dom';
import ControllerComponent from 'component/ControllerComponent';
import ImgComponent from 'component/ImgComponent';

import './css/index.scss';

var imageDatas= require('data/imageDatas');


imageDatas=(function genImageURL(imageDatasArr) {
    for (var i = 0, j = imageDatasArr.length; i < j; i++) {
        var singleImageData = imageDatasArr[i];
        singleImageData.imageURL=require("./images/"+singleImageData.fileName+".jpg");
        imageDatasArr[i] = singleImageData;
    }
    return imageDatasArr;
})(imageDatas);


function getRangeRandom(low,high){
	  return Math.ceil(Math.random() * (high - low) + low);
}

function get30DegRandom(){
      return Math.random()>0.5?"":"-" +Math.ceil(Math.random()*30)
}


class GalleryApp extends Component {  
  constructor(props) {
	    super(props)
	    this.state= {
	       	imgsArrangeArr:[
	             {
	             	pos:{
	             		left:'0',
	             		top:'0'
	             	},
	             	rotate:0,
	             	isInverse:false
	             }         
  			]	
  		}

  		this.Constant={
	  	 centerPos:{
	  	 	left:0,
	  	 	right:0
	  	 },

	  	 hPosRange:{
	  	 	leftSecX:[0,0],
	  	 	rightSecX:[0,0],
	  	 	y:[0,0]
	  	 },

	  	 vPosRange:{
	  	 	x:[0,0],
	  	 	topY:[0,0]
	  	 }
  
	}


}
  //排布图片
  rearrange (centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2),    // 取一个或者不取
        topImgSpliceIndex = 0,

        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);


        //console.log(centerPos);

        // 首先居中 centerIndex 的图片, 居中的 centerIndex 的图片不需要旋转
        imgsArrangeCenterArr[0] = {
          pos: centerPos,
          rotate: 0,
          isCenter: true
        };

        // 取出要布局上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        // 布局位于上侧的图片
        imgsArrangeTopArr.forEach(function (value, index) {
            imgsArrangeTopArr[index] = {
              pos: {
                  top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                  left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
              },
               rotate: get30DegRandom(),
              isCenter: false
            };
        });

        // 布局左右两侧的图片
        for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            var hPosRangeLORX = null;

            // 前半部分布局左边， 右半部分布局右边
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i] = {
              pos: {
                  top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                  left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
              },
              rotate: get30DegRandom(),
              isCenter: false
            };

        }

        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });
  }

  //翻转图片
  inverse(index){
      return function(){
      	  var imgsArrangeArr=this.state.imgsArrangeArr;
      	  imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse;
      	  this.setState({
      	  	 imgsArrangeArr:imgsArrangeArr
      	  })
              
      }.bind(this)
  }

  //居中图片
  center(index){
  	return function(){
  		this.rearrange(index);
  	}.bind(this)
  }
   
  //图片位置范围
  componentDidMount(){
     var stageDom=findDOMNode(this.refs.stage),
  	     stageW=stageDom.scrollWidth,
  	     stageH=stageDom.scrollHeight,
  	     halfStageW=Math.ceil(stageW/2),
  	     halfStageH=Math.ceil(stageH/2);


      //每个图片大小
      var imgFigureDOM =findDOMNode(this.refs.imgFigure0),
          imgW = imgFigureDOM.scrollWidth,
          imgH = imgFigureDOM.scrollHeight,
          halfImgW = Math.ceil(imgW / 2),
          halfImgH = Math.ceil(imgH / 2);

      //中心图片位置
      this.Constant.centerPos={
      	 left:halfStageW- halfImgW,
      	 top:halfStageH- halfImgH
      }
      
      //左侧右侧图片范围
      this.Constant.hPosRange.leftSecX[0]=-halfImgW;
      this.Constant.hPosRange.leftSecX[1]=halfStageW- halfImgW*3;
      this.Constant.hPosRange.rightSecX[0]=halfStageW+halfImgW;
      this.Constant.hPosRange.rightSecX[1]=stageW-halfImgW;
      this.Constant.hPosRange.y[0]=-halfImgH;
      this.Constant.hPosRange.y[1]=stageH- halfImgH;

      //上侧图片范围
      this.Constant.vPosRange.topY[0]=-halfImgH;
      this.Constant.vPosRange.topY[1]=halfStageH- halfImgH*3;
      this.Constant.vPosRange.x[0]=halfStageW - imgW;
      this.Constant.vPosRange.x[1]=halfStageW;

      
      this.rearrange(0)
  }


   
  render() {
     var controllerUnits=[],
     imgFigures=[];

     imageDatas.forEach(function(value,index){
        if(!this.state.imgsArrangeArr[index]){
        	this.state.imgsArrangeArr[index]={
        		pos:{
        			left:0,
        			top:0,
        		},
        		rotate:0,
        		isInverse:false,
        		isCenter:false
        	}
        }
  	    imgFigures.push(<ImgComponent data={value} center={this.center(index)} inverse={this.inverse(index)} arrange={this.state.imgsArrangeArr[index]}   ref={"imgFigure"+index} key={"imgFigure"+index}/>)
  	    controllerUnits.push(<ControllerComponent arrange={this.state.imgsArrangeArr[index]} center={this.center(index)} inverse={this.inverse(index)} key={index} />)
     }.bind(this));


    return (
	    <section className="stage" ref="stage">
	         <section className="img-sec">
	             {imgFigures}
	         </section>
             
             <nav  className="controller-nav">
                 {controllerUnits}
             </nav>

	    </section>
    )
  }
}





render(<GalleryApp />, document.getElementById('app'));
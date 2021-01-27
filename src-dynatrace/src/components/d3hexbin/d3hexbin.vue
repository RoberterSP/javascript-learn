<template>
  <div class="d3_hexbin" style="width: 100%; height: 100%;">
    <div class="dbb-a d3_hexbin">
      <div class="-dbb-b dbb-d" v-show="hexbinData.total_num">
        <canvas :id="canvasId" :width="hexbinData.canvas_width" :height="hexbinData.canvas_height" ></canvas>
      </div>
    </div>
    <div class="dC-j dC-db dC-e dC-T" >
      <span v-if="hexbinData.total_num!=0&&hexbinData.normal_num - hexbinData.total_num === 0">{{hexbinData.normal_num}}</span>
      <span class="dC-b red" v-if="hexbinData.error_num&&hexbinData.error_num>0" >{{hexbinData.error_num}}</span>
      <span class="dC-fb" v-if="hexbinData.error_num&&hexbinData.error_num>0">/{{hexbinData.total_num}}</span>
    </div>
    <span class="dlb-b dC-ob dC-i dC-e" v-if="hexbinData.total_num!=0&&hexbinData.normal_num - hexbinData.total_num === 0">All fine</span>
  </div>
</template>
<script>

import * as d3 from 'd3-hexbin'
import {forEach} from 'lodash'

/* eslint-disable */
// Defaults
let defaults = {
  boardRadius: '3',
  // 默认绿色
  hexColor: '#7DC540',
  lineWidth: 2,
  // 红色（异常色）
  warnHexColor: '#DC172A',
  // 背景色
  bgColor: '#353535'
}
function getCalculateCircle (counts) {
  for(let i=1; i<=100; i++) {
    if ((3*Math.pow(i,2) - 3*i + 1) >= counts) {
      defaults.boardRadius = i
      break
    }
  }
}

// Hex boards get shoved in here as they're created.
let activeHexBoards = {}
let activeHexBoardKeys = []

// Hex board class.
let HexBoard = function(options, master, maxCounts, errorNum) {
    // Peel off the options.
    this.boardRadius = options.boardRadius || defaults.boardRadius
    this.hexColor = options.hexColor || defaults.hexColor
    this.height = options.height
    this.width = options.width
    this.id = options.id
    // Peel off the master.
    this.master = master
    // Define vars.
    this.hexTiles = []

    this.build = function() {
      /* Calculate tile and board dimensions */
      let targetHeight = this.height
      let targetWidth = this.width
      // Vertex radius is minimum out of width/height ratio.
      let vertexRadiusOne = (targetWidth) / (3 * this.boardRadius - 1)
      let vertexRadiusTwo = (targetHeight) / (4 * this.boardRadius - 2) * 2 / Math.sqrt(3)
      let vertexRadius = Math.min(vertexRadiusOne, vertexRadiusTwo)
      // Side radius is based on vertex radius.
      let sideRadius = Math.sqrt(3) * vertexRadius / 2
      // Board dimensions are based on side and vertex radii.
      let boardHeight = sideRadius * (4 * this.boardRadius - 2) + 4
      let boardWidth = vertexRadius * (3 * this.boardRadius - 1) + 4
      /* Assemble the hex tile list. */
      this.hexTiles = []
      // First tile in the center.
      this.hexTiles[0] = new HexTile(boardWidth / 2, boardHeight / 2, sideRadius, vertexRadius, this.hexColor)

      // Rest of the tiles in rings.
      for (let ringI = 1; ringI < this.boardRadius; ringI++) {
        for (let cardinalHexI = 1; cardinalHexI <= 6; cardinalHexI++) {
          // 7-cardinalHexI   ====> cardinalHexI
          let xCenter = (boardWidth / 2) + sideRadius * (2 * ringI) * Math.cos((2 * Math.PI / 6) * (7-cardinalHexI) + (Math.PI / 6))
          let yCenter = (boardHeight / 2) + sideRadius * (2 * ringI) * Math.sin((2 * Math.PI / 6) * (7-cardinalHexI) + (Math.PI / 6))

          let hexColor = this.hexTiles.length < maxCounts ? this.hexColor : defaults.bgColor
          if (this.hexTiles.length < maxCounts && this.hexTiles.length >= maxCounts - errorNum) {
            hexColor = defaults.warnHexColor
          }
          // console.log('this.hexTiles.length', this.hexTiles.length)
          this.hexTiles[this.hexTiles.length] = new HexTile(xCenter, yCenter, sideRadius, vertexRadius, hexColor)

          let webHexCount = ringI - 1
          if (webHexCount < 0) {
            webHexCount = 0
          }

          for (let webHexI = 1; webHexI <= webHexCount; webHexI++) {
            // 2+cardinalHexI
            let webHexXCenter = xCenter + (sideRadius * 2 * Math.cos((2 * Math.PI / 6) * (5-cardinalHexI) + (Math.PI / 6))) * webHexI
            let webHexYCenter = yCenter + (sideRadius * 2 * Math.sin((2 * Math.PI / 6) * (5-cardinalHexI) + (Math.PI / 6))) * webHexI
            let hexColor22 = this.hexTiles.length < maxCounts ? this.hexColor : defaults.bgColor
            if (this.hexTiles.length < maxCounts && this.hexTiles.length >= maxCounts - errorNum) {
              hexColor22 = defaults.warnHexColor
            }
            this.hexTiles[this.hexTiles.length] = new HexTile(webHexXCenter, webHexYCenter, sideRadius, vertexRadius, hexColor22)
          }
        }
      }
    }

    // Redraws the frame.
    this.draw = function() {
      // Clear the frame.
      let ctx = this.master.getContext("2d")
      // Iterate through each tile.
      for (let i = 0; i < this.hexTiles.length; i++) {
        this.hexTiles[i].draw(ctx)
      }
    }
}

let HexTile = function(centerX, centerY, sideRadius, vertexRadius, hexColor) {
  this.centerX = centerX
  this.centerY = centerY
  this.sideRadius = sideRadius
  this.vertexRadius = vertexRadius
  this.hexColor = hexColor

  this.draw = function(ctx) {
    let centerX = this.centerX
    let centerY = this.centerY
    drawPolygon(6, this.vertexRadius, this.centerX, this.centerY, 0, ctx, defaults.bgColor, this.hexColor)
  }
}

// Create a new hex board and index it.
let createHexBoard = function(master, maxCounts, errorNum) {
  // Pull the options off of the master.
  let options = [];
  options.id = master.getAttribute("id");
  options.height = master.getAttribute("height");
  options.width = master.getAttribute("width");
  options.boardRadius = master.getAttribute("data-boardRadius");
  options.hexColor = master.getAttribute("data-hexColor");

  // Create hex board and shove it in the array.
  let newHexBoard = new HexBoard(options, master, maxCounts, errorNum);
  activeHexBoards[newHexBoard.id] = newHexBoard;
  activeHexBoardKeys[activeHexBoardKeys.length] = newHexBoard.id;
};

let drawPolygon = function(sides, vertexRadius, centerX, centerY, angleOffset, ctx, stroke, fill) {
  ctx.strokeStyle = stroke;
  // 控制边距
  ctx.lineWidth = defaults.lineWidth;
  ctx.fillStyle = fill;

  ctx.beginPath();
  for (let vertexI = 1; vertexI <= sides; vertexI++) {
    let toX = vertexRadius * Math.cos((2 * Math.PI / sides) * vertexI + angleOffset) + centerX;
    let toY = vertexRadius * Math.sin((2 * Math.PI / sides) * vertexI + angleOffset) + centerY;

    if (vertexI === 1) {
      ctx.moveTo(toX, toY);
    } else {
      ctx.lineTo(toX, toY);
    }
  }
  ctx.closePath();

  ctx.fill();
  ctx.stroke();
};

export default {
  data () {
    return {
    }
  },
  props: {
    canvasId: {
      type: String,
      required: true,
      default: function() {
        return 'canvas_id_1'
      }
    },
    hexbinData: {
      type: Object,
      required: true,
      default: function() {
        return {
          canvas_width: '100',
          canvas_height: '86',
          value: '',
          value1: '',
          value2: '',
          counts: 4
        }
      }
    }
  },
  methods: {
    resetDrawView (hexbinData) {
      this.drawFunc(hexbinData)
    },
    drawFunc (hexbinData) {
      // 先清空一下画布
      var c = document.getElementById(this.canvasId)
      var cxt = c.getContext("2d")
      cxt.clearRect(0, 0, c.width, c.height)

      // 先计算 radius
      getCalculateCircle(hexbinData.total_num)

      let _this = this
      let hexbin = d3.hexbin()

      createHexBoard(document.querySelector('#'+ _this.canvasId), hexbinData.total_num, hexbinData.error_num)

      forEach(activeHexBoardKeys, value => {
          activeHexBoards[value].build()
          activeHexBoards[value].draw()
        }
      )
    }
  },
  mounted () {
    this.drawFunc(this.hexbinData)
  },
  created () {
  },
  components: {
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.d3_hexbin{
  canvas{
    margin-bottom: 10px;
  }
  .dC-e.dC-T{
    span{
      font-size:14px !important;
      font-weight:500;
      line-height:20px!important;
    }
    .dC-b{
      font-size: 14px!important;
      font-weight: 300;
      line-height: 20px!important;
    }
    .dC-fb{
      font-size:14px !important;
      font-weight:500;
      line-height:20px!important;
    }
  }
}
</style>

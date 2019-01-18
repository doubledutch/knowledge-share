import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'

export default class FilterCell extends Component {
  constructor(props) {
    super(props)
    this.s = createStyles(props)
  }

  render() {
    const { item, select, state } = this.props

    if (state)
      return (
        <TouchableOpacity style={this.s.buttonContainerMargin}>
          <Text style={this.s.title}>{item}</Text>
        </TouchableOpacity>
      )

    else if (select)
      return (
        <TouchableOpacity
          onPress={() => this.props.removeFilter(item)}
          style={this.s.buttonContainerColor}
        >
          <Text style={this.s.titleColor}>{item.title}</Text>
        </TouchableOpacity>
      )
    return (
      <TouchableOpacity onPress={() => this.props.addFilter(item)} style={this.s.buttonContainer}>
        <Text style={this.s.title}>{item.title}</Text>
      </TouchableOpacity>
    )
  }
}

function hexToRgb(hex) {
  var hex = hex.slice(1)
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `${r},${g},${b}`
}

const createStyles = props =>
  StyleSheet.create({
    buttonContainer: {
      height: 25,
      paddingHorizontal: 20,
      justifyContent: 'center',
      marginHorizontal: 10,
      marginVertical: 5,
      borderRadius: 25,
      backgroundColor: `rgba(${hexToRgb(props.primaryColor)},0.1)`,
    },
    buttonContainerMargin: {
      height: 25,
      paddingHorizontal: 20,
      justifyContent: 'center',
      marginVertical: 5,
      marginRight: 10,
      borderRadius: 25,
      backgroundColor: `rgba(${hexToRgb(props.primaryColor)},0.1)`,
    },
    title: {
      fontSize: 14,
      fontWeight: 'bold',
      color: props.primaryColor,
    },
    buttonContainerColor: {
      backgroundColor: props.primaryColor,
      height: 25,
      paddingHorizontal: 20,
      justifyContent: 'center',
      marginHorizontal: 10,
      marginVertical: 5,
      borderRadius: 25,
    },
    titleColor: {
      fontSize: 14,
      fontWeight: 'bold',
      color: 'white',
    },
  })

'use strict'
import React, { Component } from 'react'
import ReactNative, { TouchableOpacity, Text, View } from 'react-native'
import {translate as t} from '@doubledutch/rn-client'

export default class ReportModal extends Component {
  render() {
    const { report, reportQuestion, handleChange, primaryColor } = this.props 

    return (
      <TouchableOpacity style={s.modalCover}
          onPress={() => {
            handleChange("showReportModal", false);
          }}>
          <TouchableOpacity style={s.modal}>
            <Text style={s.title}>{t("confirm_report")}</Text>
            <View style={s.buttonBox}>
              <TouchableOpacity style={[s.buttonContainer, {borderColor: primaryColor}]} 
                onPress={() => { handleChange("showReportModal", false);}}>
                <Text style={[s.buttonTextColor, {color: primaryColor}]}>{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.buttonContainerColor, {backgroundColor: primaryColor}]}
                onPress={() => { reportQuestion(report)}}>
                <Text style={s.buttonText}>{t("report_content")}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
      </TouchableOpacity>
    )
  }
}

const s = ReactNative.StyleSheet.create({
  buttonContainer: {
    height: 40,
    padding: 10,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    alignContent: 'center',
    justifyContent: 'center'
  },
  buttonContainerColor: {
    height: 40,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignContent: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: "white",
    fontSize: 14
  },
  buttonTextColor: {
    fontSize: 18
  },
  buttonBox: {
    flexDirection: "row",
    padding: 10
  },
  title : {
    fontSize: 18,
    textAlign: "center",
    marginHorizontal: 40,
    color: "#404040",
  },
  modalCover: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1
  },
  modal : {
    height: 200,
    flexDirection: 'column',
    backgroundColor: 'white',
    marginTop: 100,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  }  
})

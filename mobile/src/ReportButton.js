import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import { translate as t } from '@doubledutch/rn-client'

export default ({ currentUser, item, isReported, handleReport, handleEdit }) =>
  item.creator.id !== currentUser.id ? (
    <TouchableOpacity style={s.buttonContainer} onPress={() => handleReport(item)}>
      <Text style={s.title}>{isReported ? t('reported') : t('report')}</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity style={s.buttonContainer} onPress={() => handleEdit(item)}>
      <Text style={s.title}>{t("edit")}</Text>
    </TouchableOpacity>
  )

const s = StyleSheet.create({
  buttonContainer: {
    height: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 14,
    color: '#9B9B9B',
  },
})

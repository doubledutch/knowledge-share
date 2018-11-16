import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import client, { translate as t } from '@doubledutch/rn-client'

export default class SortSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentSort: t('popular'),
      sortList: [t('popular'), t('recent'), t('questions')],
      search: false,
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        {this.topicsHeader()}
        {this.sortTable()}
      </View>
    )
  }

  sortTable = () => {
    const { primaryColor } = this.props
    return (
      <View style={s.table}>
        {this.state.sortList.map((item, i) => (
          <TouchableOpacity
            style={s.row}
            key={i}
            onPress={item === this.props.currentSort ? null : () => this.props.sortTopics(item)}
          >
            <Text
              style={[s.rowText, item === this.props.currentSort ? { color: primaryColor } : null]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  topicsHeader = () => (
    <View style={s.buttonContainer}>
      <TouchableOpacity onPress={() => this.props.handleChange('showSort', false)}>
        <Text style={s.closeButton}>X</Text>
      </TouchableOpacity>
      <Text style={s.title}>{t('sort')}</Text>
      <Text style={{ width: 25 }} />
    </View>
  )
}

const s = StyleSheet.create({
  table: {
    flexDirection: 'column',
  },
  row: {
    paddingTop: 20,
    paddingBottom: 20,
    marginRight: 20,
    marginLeft: 20,
    borderBottomWidth: 1,
    borderColor: '#EFEFEF',
  },
  rowText: {
    fontSize: 20,
    color: '#404040',
  },
  buttonContainer: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#EFEFEF',
  },
  title: {
    fontSize: 24,
    flex: 1,
    textAlign: 'center',
    color: '#9B9B9B',
  },
  closeButton: {
    marginLeft: 20,
  },
})

import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import client, { translate as t } from '@doubledutch/rn-client'

export default class TableHeader extends Component {
  renderPrompt = questions => {
    var questions = Object.values(questions)
    if (this.props.currentSort === t('questions')) {
      questions = questions.filter(item => item.creator.id === this.props.currentUser.id)
    }
    const filteredQuestions = questions.filter(item => item.block === false) || []
    if (filteredQuestions.length === 0) {
      return (
        <View style={{ marginTop: 96 }}>
          <Text
            style={{
              marginTop: 30,
              textAlign: 'center',
              fontSize: 20,
              color: '#9B9B9B',
              marginBottom: 5,
              height: 25,
            }}
          >
            {this.props.currentSort === t('questions') ? t('no_question') : t('conversation')}
          </Text>
          <TouchableOpacity style={{ marginTop: 5, height: 25 }} onPress={this.props.showModal}>
            <Text style={{ textAlign: 'center', fontSize: 18, color: this.props.primaryColor }}>
              {t('tap')}
            </Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  render() {
    const { questions, primaryColor } = this.props
    const pc = { color: primaryColor }
    return (
      <View>
        <View style={{ height: 50, marginTop: 10, marginBottom: 1 }}>
          <View style={s.buttonContainer}>
            <TouchableOpacity
              style={s.button2}
              onPress={() => this.props.handleChange('showSort', true)}
            >
              <Text style={[s.dashboardButtonTitle, pc]}>{t('sort')}: </Text>
              <Text style={s.dashboardButton}>{this.props.currentSort}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.button3} disabled={!questions} onPress={this.getFilters}>
              <Text style={[s.dashboardButtonTitle, pc]}>{t('filters')}: </Text>
              <Text style={s.dashboardButton}>
                {this.props.selectedFilters.length} {t('topics')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {this.renderPrompt(questions)}
      </View>
    )
  }

  getFilters = () => {
    this.props.handleChange('showFilters', true)
  }
}

const s = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  button2: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  button3: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  dividerSm: {
    width: 30,
  },
  dashboardButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#364247',
  },
  dashboardButtonTitle: {
    fontSize: 16,
  },
})

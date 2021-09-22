import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Button,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal
} from 'react-native';
import Slider from '@react-native-community/slider';
import Pdf from 'react-native-pdf';
import { ProgressView } from "@react-native-community/progress-view";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';

// pdf uri
const source = { uri: 'https://books.goalkicker.com/ReactNativeBook/ReactNativeNotesForProfessionals.pdf', cache: true };

export default class PDFExample extends React.Component {
  state = {

    num: 1, total: 1,
    SliderValue: 1,
    jump_num: "", progress: 0,
    book_mark: ""
  }

  // book mark ui
  renderItem = ({ item, index }) => {
    if (index !== 0) return (
      <View>

        {/* Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: "space-around",
          paddingHorizontal: hp('2%'),
          backgroundColor: "#fff",
          marginVertical: hp('1%'),
          alignItems: "center"
        }}>

          {/* Bookmark Button */}
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: this.state.book_mark.split(',').includes(this.state.num.toString()) ? "rgba(99, 96, 255, 1)" : "rgba(244, 244, 244, 1)" }]}
            onPress={async () => {
              let newstr = await this.state.book_mark
              let array = await newstr.split(',')
              let index = await array.indexOf(item.toString())
              array.splice(index, 1)
              this.setState({ book_mark: array.toString() })
            }}
            onLongPress={() => this.setState({ show_bk: !this.state.show_bk })}
          >
            <FontAwesome
              name={'bookmark-o'}
              color={this.state.book_mark.split(',').includes(this.state.num.toString()) ? "#FFF" : 'rgba(41, 45, 50, 1)'}
              size={hp('2.2%')}
            />
          </TouchableOpacity>

          <Text style={{ alignSelf: "center" }}>{item}</Text>

          {/* Bookmark Button */}
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: this.state.book_mark.split(',').includes(this.state.num.toString()) ? "rgba(99, 96, 255, 1)" : "rgba(244, 244, 244, 1)" }]}
            onPress={() => this.setState({ num: parseInt(item), show_bk: false })}
          >
            <Foundation
              name={'page-search'}
              color={this.state.book_mark.split(',').includes(this.state.num.toString()) ? "#FFF" : 'rgba(41, 45, 50, 1)'}
              size={hp('2.2%')}
            />
          </TouchableOpacity>
        </View>

        <Pdf
          key={index}
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          singlePage
          horizontal
          page={parseInt(item)}
          onPressLink={(uri) => {
            console.log(`Link presse: ${uri}`)
          }}
          style={styles.pdf} />
      </View>
    )
  }
  render() {
    // slider %
    const ptr_zoom = (this.state.SliderValue / 1.5 * 100).toFixed(0)

    return (
      <View style={styles.container}>

        {/* Header */}
        {!this.state.show_bk &&
          <View style={styles.header}>

            {/* Progress */}
            <TouchableOpacity
              onPress={() => this.setState({ Popup: true })}
              style={{
                backgroundColor: "rgba(244, 244, 244, 1)",
                height: hp('0.5%'),
                width: wp('80%'),
                borderRadius: hp('0.5%'),
                borderColor: 'rgba(244, 244, 244, 1)',
              }}>
              <View
                style={{
                  width: `${parseFloat((this.state.num / this.state.total * 100).toFixed(0))}%`,
                  backgroundColor: "rgba(99, 96, 255, 1)",
                  height: hp('0.5%'),
                  borderRadius: hp('0.5%')
                }}>

              </View>
            </TouchableOpacity>

            {/* Bookmark Button */}
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: this.state.book_mark.split(',').includes(this.state.num.toString()) ? "rgba(99, 96, 255, 1)" : "rgba(244, 244, 244, 1)" }]}
              onPress={async () => {
                let newstr = await this.state.book_mark
                let array = await newstr.split(',')
                if (array.includes(this.state.num.toString())) {
                  let index = await array.indexOf(this.state.num.toString())
                  array.splice(index, 1)
                }
                else {
                  array.push(this.state.num)
                }
                this.setState({ book_mark: array.toString() })
              }}
              onLongPress={() => this.setState({ show_bk: !this.state.show_bk })}
            >
              <FontAwesome
                name={'bookmark-o'}
                color={this.state.book_mark.split(',').includes(this.state.num.toString()) ? "#FFF" : 'rgba(41, 45, 50, 1)'}
                size={hp('2.2%')}
              />
            </TouchableOpacity>
          </View>
        }

        {!this.state.show_bk ? <Pdf
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`number of pages: ${numberOfPages}`);
            this.setState({ total: numberOfPages })
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`current page: ${page}`);
            this.setState({ num: page, total: numberOfPages, progress: parseFloat((this.state.num / this.state.total * 1).toFixed(1)) })
          }}
          onError={(error) => {
            console.log(error);
          }}
          scale={this.state.SliderValue}
          enableRTL
          page={this.state.num}
          onPressLink={(uri) => {
            console.log(`Link presse: ${uri}`)
          }}
          style={styles.pdf} />
          :
          <FlatList
            style={{ flex: 1, }}
            showsVerticalScrollIndicator={false}
            data={this.state.book_mark.split(",")}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />


        }

        {this.state.Popup &&
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.Popup}
            onRequestClose={() => {
              this.setState({ Popup: false })
            }}
          >
            <View style={{
              flex: 1,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: hp('0.2%')
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              backgroundColor: "rgba(50, 50, 50, 0.8)",
              justifyContent: "center"
            }}>
              <TouchableOpacity onPress={() => this.setState({ Popup: false })}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute"
                }} />
              <View style={{
                backgroundColor: "#FFF",
                borderRadius: hp('2%'),
                paddingHorizontal: hp('1.5%'),
                width: '85%',
                alignSelf: "center",
              }}>

                <Text allowFontScaling={false}
                  style={{
                    textAlign: "center",
                    fontSize: hp('2%'),
                    fontFamily: "Roboto-Regular",
                    marginVertical: hp('2%')
                  }} >Jump To</Text>

                <TextInput
                  style={{
                    width: "100%",
                    color: "#222",
                    borderRadius: hp('2%'),
                    borderWidth: hp('0.2%'),
                    borderColor: "#CCC",
                    paddingHorizontal: hp('2%'),
                    marginVertical: hp('2%')
                  }}
                  onChangeText={(jump_num) => { this.setState({ jump_num }) }}
                  value={this.state.jump_num}
                  placeholder="Please enter page number..."
                  keyboardType="phone-pad"
                  allowFontScaling={false}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginVertical: hp('1%')
                  }}>

                  {/* Cancel Button */}
                  <TouchableOpacity
                    onPress={() => this.setState({ Popup: false })}
                    style={{
                      width: wp("35%"),
                      height: hp('5%'),
                      alignSelf: 'center',
                      justifyContent: 'center',
                      borderRadius: hp('0.8%'),
                      borderWidth: hp("0.2%"),
                      borderColor: "rgba(255, 0, 0, 1)"
                    }}>
                    <Text allowFontScaling={false}
                      style={{
                        fontSize: hp('2%'),
                        textAlign: 'center',
                        color: "rgba(255, 0, 0, 1)",
                        alignSelf: "center",
                        fontFamily: 'Roboto-Regular',
                      }}>Cancel</Text>
                  </TouchableOpacity>

                  {/* Yes Button */}
                  <TouchableOpacity
                    onPress={() => this.setState({ num: parseInt(this.state.jump_num), Popup: false })}
                    style={{
                      width: wp("35%"),
                      height: hp('5%'),
                      alignSelf: 'center',
                      backgroundColor: "rgba(99, 96, 255, 1)",
                      justifyContent: 'center',
                      borderRadius: hp('0.8%'),
                    }}>
                    <Text allowFontScaling={false}
                      style={{
                        fontSize: hp('2%'),
                        textAlign: 'center',
                        color: "#FFF",
                        alignSelf: "center",
                        fontFamily: 'Roboto-Regular',
                      }}>Jump</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  input: {
    height: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: "space-between",
    paddingHorizontal: hp('2%'),
    backgroundColor: "#fff",
    marginVertical: hp('1%'),
    alignItems: "center"
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: hp('4.5%'),
    height: hp('4.5%'),
    borderRadius: hp('4.5%')
  },
});
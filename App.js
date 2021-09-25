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
  Modal,
  ScrollView
} from 'react-native';
import Pdf from 'react-native-pdf';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import * as Animatable from 'react-native-animatable';
import Slider from '@react-native-community/slider';
// pdf uri
const source = { uri: 'https://books.goalkicker.com/ReactNativeBook/ReactNativeNotesForProfessionals.pdf', cache: true };

export default class PDFExample extends React.Component {
  state = {

    num: 1, total: 1,
    SliderValue: 1,
    jump_num: "", progress: 0,
    book_mark: "'',1,5,25,62,75,91",
    show_bk: false,
    value: 0,
    back_ani: 0,
    next_ani: 0,
    nextpage: "pulse"
  }

  onValueChanged = value => this.setState({ value });

  // book mark ui
  renderItem = ({ item, index }) => {
    if (index !== 0) return (
      <View >
        <Animatable.View animation={"slideInUp"} delay={150} >
          <View style={{
            flexDirection: 'row',
            justifyContent: "space-around",
            backgroundColor: "#fff",
            marginVertical: hp('1%'),
            alignItems: "center"
          }}>

            {/* Bookmark Button */}
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: "rgba(99, 96, 255, 1)" }]}
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
                color={"#FFF"}
                size={hp('2.2%')}
              />
            </TouchableOpacity>

            <Text style={{ alignSelf: "center" }}>{item}</Text>

            {/* Bookmark Button */}
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: "rgba(99, 96, 255, 1)" }]}
              onPress={() => this.setState({ show_bk: false, num: parseInt(item), })}
            >
              <Foundation
                name={'page-search'}
                color={"#FFF"}
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
            style={[styles.pdf]} />
        </Animatable.View>

      </View>
    )
  }
  animation = async (page) => {
    if (page !== this.state.num&&page) {
      if (page > this.state.num) this.setState({ nextpage: "slideInRight" })
      else this.setState({ nextpage: "slideInLeft" })
      this.setState({ num: page, progress: parseFloat((this.state.num / this.state.total * 1).toFixed(1)), animation: true })
    } else {
      this.setState({ animation: false })

    }
  }
  showmenu = () => {
    this.setState({ showbtn: !this.state.showbtn })

  }
  render() {


    return (
      <View style={styles.container}>

        {/* Header */}
        <Animatable.View animation={"slideInDown"} delay={250} style={styles.header}>
          {/* Progress */}
          <Animatable.View animation={"slideInLeft"} delay={250}
          style={{
            width: wp('80%'),
            flexDirection: "row",
            alignItems: 'center'
          }}>
            <Slider
              style={{ width: "95%" }}
              maximumValue={this.state.total}
              onSlidingComplete={(num) => this.animation(parseInt(num))}
              value={this.state.num}
              minimumValue={1}
              step={1}
              thumbTintColor={"rgba(99, 96, 255, 1)"}
              minimumTrackTintColor="rgba(99, 96, 255, 1)"
              maximumTrackTintColor="rgba(244, 244, 244, 1)"
            />
            <Text>{(this.state.num / this.state.total * 100).toFixed(0)}%</Text>
          </Animatable.View>



          {/* Bookmark Button */}
          <Animatable.View animation={"slideInRight"} delay={250}>
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
              onLongPress={() => this.setState({ show_bk: !this.state.show_bk, showbtn: false })}
            >

              <FontAwesome
                name={'bookmark-o'}
                color={this.state.book_mark.split(',').includes(this.state.num.toString()) ? "#FFF" : 'rgba(41, 45, 50, 1)'}
                size={hp('2.2%')}
              />
            </TouchableOpacity>
          </Animatable.View>
        </Animatable.View>




        {!this.state.show_bk ?

          <View style={{ flex: 1 }}>
            <Animatable.View
              animation={this.state.nextpage}
              delay={150}
              style={{ flex: 1 }} direction="alternate"
              easing="ease-in-out-sine"
              onAnimationEnd={() => this.setState({ nextpage: "" })}>
              <Pdf
                source={source}
                onLoadComplete={(numberOfPages, filePath, {width, height}, tableContents) => {
                  this.setState({ total: numberOfPages })
                  // console.log(tableContents)
                }}
                onPageChanged={async (page, numberOfPages) => {
                 this.setState({num:page})
                }}
                onError={(error) => {
                  console.log(error);
                }}
                onScaleChanged={(SliderValue) => { this.setState({ SliderValue: SliderValue }) }}
                scale={this.state.SliderValue}
                maxScale={2}
                minScale={1}
                enablePaging
                page={this.state.num}
                horizontal
                onPageSingleTap={(page) => this.showmenu()}
                onPressLink={(uri) => {
                  console.log(`Link presse: ${uri}`)
                }}
                style={styles.pdf} />
            </Animatable.View>

          </View>
          :
          <FlatList
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            data={this.state.book_mark.split(",")}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        }





        {/* {<Animatable.View
          animation={this.state.showbtn ? "zoomIn" : "zoomOut"} delay={250}
          style={{ width: "50%", height: "50%", position: "absolute", alignSelf: "flex-end",bottom:"5%" }}>
          <BigSlider
            maximumValue={2}
            trackStyle={{ backgroundColor: 'rgba(208, 88, 10, 0.6)' }}
            //   renderLabel={() => <Text style={{textAlign:'center',marginVertical:"2%",marginHorizontal:"2%"}}>
            //    {(this.state.SliderValue / 2 * 100).toFixed(0)}%
            // </Text>}
            style={{ width: 40, backgroundColor: 'rgba(0,0,0,.7)', height: "50%" }}
            value={this.state.SliderValue}

            onValueChange={SliderValue => { this.setState({ SliderValue }) }}
            minimumValue={1} />

            <Slider
              style={{  height: "50%" ,transform: [{rotate:"90deg"}] }}
              maximumValue={2}
              onSlidingComplete={(SliderValue) => this.animation(parseInt(SliderValue))}
              value={this.state.SliderValue}
              inverted
              minimumValue={1}
              step={0.1}
              thumbTintColor={"rgba(99, 96, 255, 1)"}
              minimumTrackTintColor="rgba(99, 96, 255, 1)"
              maximumTrackTintColor="#fff"
            />
        </Animatable.View>} */}
        <Animatable.View
          animation={this.state.showbtn ? "slideInUp" : "slideOutDown"} delay={250}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: hp('2%'),
            paddingVertical: hp('1%')
          }}>


        {this.state.num!==1&&   <Animatable.View
            animation={this.state.showbtn ? "slideInLeft" : "slideOutLeft"} delay={250}>
          <TouchableOpacity
              onPress={() => this.animation(this.state.num - 1)}
              onLongPress={() => this.setState({ select_back_ani: true })}
              style={{
                backgroundColor: "rgba(255, 255, 255, 1)",
                borderRadius: hp('1%'),
                paddingVertical: hp('2%'),
                width: wp('35%'),
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.20,
                shadowRadius: 1.41,
                elevation: 2,
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: hp('2.4%'),
                  color: "rgba(130, 130, 130, 1)",
                  lineHeight: hp('3%')
                }}>Previous</Text>
            </TouchableOpacity>
          </Animatable.View>}


          <Animatable.View
            animation={this.state.showbtn ? "zoomIn" : "zoomOut"} delay={250}
            style={{alignSelf:"center"}}>

            <TouchableOpacity
              onPress={() => this.setState({ Popup: false })}>
              <Text style={{ alignSelf: "center", color: "rgba(99, 96, 255, 1)", marginHorizontal: "2%" }}>{this.state.num} / {this.state.total}</Text>
            </TouchableOpacity>
          </Animatable.View>


          {this.state.num!==this.state.total&&  <Animatable.View
              animation={this.state.showbtn ? "slideInRight" : "slideOutRight"} delay={250}
            >
              <TouchableOpacity
                onPress={() => this.animation(this.state.num + 1)}
                onLongPress={() => this.setState({ select_next_ani: true })}
                style={{
                  backgroundColor: "rgba(99, 96, 255, 1)",
                  borderRadius: hp('1%'),
                  paddingVertical: hp('2%'),
                  width: wp('35%'),
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.20,
                  shadowRadius: 1.41,
                  elevation: 2,
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: hp('2.4%'),
                    color: "#FFF",
                    lineHeight: hp('3%')
                  }}>Next</Text>
              </TouchableOpacity>
            </Animatable.View>}
          </Animatable.View>

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
                    onPress={() => {
                      this.animation(parseInt(this.state.jump_num))
                      this.setState({ Popup: false })
                    }}
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
                    onPress={() => {
                      this.animation(parseInt(this.state.jump_num))
                      this.setState({ Popup: false })
                    }}
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
        {(this.state.select_back_ani || this.state.select_next_ani) &&
          <Modal
            animationType="fade"
            transparent={true}
            visible={(this.state.select_back_ani || this.state.select_next_ani)}
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
              <TouchableOpacity onPress={() => this.setState({ select_next_ani: false, select_back_ani: false })}
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
                {this.state.select_back_ani &&
                  <ScrollView>
                    {this.state.animation_back.map((item, index) => {
                      return (<TouchableOpacity key={index} onPress={() => this.setState({ back_ani: index, select_next_ani: false, select_back_ani: false })}>
                        <Text allowFontScaling={false}
                          style={{
                            textAlign: "center",
                            fontSize: hp('2%'),
                            fontFamily: "Roboto-Regular",
                            marginVertical: hp('2%'),
                            color: index == this.state.back_ani ? "blue" : "#222"
                          }} >{item} {(index == this.state.back_ani ? "(Selected)" : "")}</Text>
                      </TouchableOpacity>)
                    })
                    }
                  </ScrollView>

                }{this.state.select_next_ani &&
                  <ScrollView>
                    {this.state.animation_next.map((item, index) => {
                      return (<TouchableOpacity key={index} onPress={() => this.setState({ next_ani: index, select_next_ani: false, select_back_ani: false })}>
                        <Text allowFontScaling={false}
                          style={{
                            textAlign: "center",
                            fontSize: hp('2%'),
                            fontFamily: "Roboto-Regular",
                            marginVertical: hp('2%'),
                            color: index == this.state.next_ani ? "blue" : "#222"
                          }} >{item} {(index == this.state.next_ani ? "(Selected)" : "")}</Text>
                      </TouchableOpacity>)
                    })


                    }
                  </ScrollView>}

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
    backgroundColor: "#fff"
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: "#fff"
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
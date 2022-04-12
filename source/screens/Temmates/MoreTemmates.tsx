import React from 'react'
import { Text, View, StyleSheet, SafeAreaView, Pressable, Image, FlatList } from 'react-native'
import arrow from "assets/images/arrow.png"
import { App } from 'models/app/App'
import Icon from 'react-native-vector-icons/EvilIcons'
import Icons from 'react-native-vector-icons/Entypo'
import { Shadow } from 'react-native-neomorph-shadows';
import { TouchableOpacity } from 'react-native-gesture-handler'
import { EventDetailsModel } from 'models/app/Calendar/EventDetailsModel'

export function MoreTemmates({route}) {

    const {users} = route.params;
    const members= App.members

    return (
        <SafeAreaView style={styles.maincontainer}>
                <View style={styles.header}>
                    <Pressable
                        style={styles.back}
                        onPress={() => App.rootNavigation.pop()}
                    >
                        <Image source={arrow} />
                    </Pressable>
                    <View style={styles.title}>
                        <Text style={styles.headerText}>THE TĒM APP</Text>
                    </View>
                    <TouchableOpacity style={styles.images}>
                        <View style={styles.images2}><Icon name='pencil' style={styles.actionIcons} /></View>
                    </TouchableOpacity>
                </View>

               <View style={{width: '100%',display: 'flex',flexDirection: 'row',marginHorizontal: 30}}>
                    <View style={{justifyContent: 'flex-start',alignItems: 'flex-start',width: '75%'}}>
                       <Text style={{color: '#0B82DC',fontSize: 18,marginTop: 20}}>TĒMATES</Text>
                    </View>
                    <TouchableOpacity style={styles.pulse}>
                    <Icons name='plus' style={styles.actionIcons} />
                    </TouchableOpacity>
               </View>
          

            <View style={{marginTop: 100,justifyContent: 'center',alignItems: 'center'}}>
                <Shadow
                inner // <- enable shadow inside of neomorph
                // swapShadows // <- change zIndex of each shadow color
                style={{
                    marginTop: 0,                    
                    borderRadius: 1,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 3,
                    },
                    shadowOpacity: 0.27,
                    shadowRadius: 4.65,
                    elevation: 6,
                    backgroundColor: '',
                    width: 300,
                    height: 1000,
                }}>
                   
                   <FlatList
                      data={members}
                      keyExtractor={(member) => member.userId}
                      renderItem={(member) => {
                        const user = member.item;
                        return (
                            <>
                          <View style={styles.member}>
                            <View style={styles.profile}>
                            <Image
                              source={{uri: user.profile_pic}}
                              style={styles.avatar}
                            />
                            </View>
                            <View style={{display:'flex', flexDirection:'row',  alignItems:'center',height:45 }}> 
                            <Text style={[styles.light, {marginLeft:5}]}>{user.first_name}</Text>
                            <Text style={[styles.light, {marginLeft:5}]}>{user.last_name}</Text>
                            </View>
                          </View>
                          </>
                        );
                      }}
                    />
                  
                </Shadow>
            </View>
        </SafeAreaView>
    )
}
const HeaderSize = 18
const styles = StyleSheet.create({
    maincontainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#2e2e2e',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 20,
        backgroundColor: '#2e2e2e',
    },

    title: {
        flex: 1,
    },
    headerText: {
        fontSize: HeaderSize,
        flex: 1,
        textAlign: 'center',
        color: '#0B82DC',
        textShadowColor: "rgba(0,0,0,0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
        shadowColor: "#000000",
    },
    back: {
        margin: 10,
    },
    MoreText: {

        color: '#0B82DC',
        textShadowColor: "rgba(0,0,0,0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
        shadowColor: "#000000",
    },
    images: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2e2e2e',
        width: 40,
        height: 40,
        borderRadius: 20,
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    actionIcons: {
        color: '#0B82DC',
        fontSize: 20,
    },
    images2: {
        borderColor: '#0B82DC',
        borderWidth: 1,
        backgroundColor: '#fff',
        width: 26,
        height: 26,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 13,
    },
    pulse: {
        alignSelf:'flex-end',justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2e2e2e',
        width: 40,
        height: 40,
        borderRadius: 20,
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    img_back: {
        alignSelf:'flex-start',justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2e2e2e',
        width: 40,
        height: 40,
        borderRadius: 20,
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    member: {
        display:"flex",
        flexDirection:"row",
        margin:10,
        
      },
      avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
      },
    light: {
      color: "#fff",
    },
      profile: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2e2e2e",
        width: 50,
        height: 50,
        borderRadius: 25,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        elevation: 5,
      },

})


function loadInfoAndMembers() {
  throw new Error('Function not implemented.')
}


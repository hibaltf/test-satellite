from doctest import testfile
import urllib.request

specialInterestSatellites = (
    {
        "type" : "spaceStations",
        "url" : "http://celestrak.com/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle"
    },

    {
        "type" : "russianASATtestDebris",
        "url" : "http://celestrak.com/NORAD/elements/gp.php?GROUP=1982-092&FORMAT=tle"
    },
    {
        "type" : "indianASATtestDebris",
        "url" : "http://celestrak.com/NORAD/elements/gp.php?GROUP=2019-006&FORMAT=tle"
    }   
)

WeatherAndEarthResourcesSat = (
    {
        "type" : "Weather",
        "url" : "http://celestrak.com/NORAD/elements/gp.php?GROUP=weather&FORMAT=tle"
    },
    {
        "type" : "earthResources",
        "url" : "http://celestrak.com/NORAD/elements/gp.php?GROUP=resource&FORMAT=tle"
    },
    {
        "type" : "disasterMonitoring",
        "url" : "http://celestrak.com/NORAD/elements/gp.php?GROUP=dmc&FORMAT=tle"
    }
)

scientificSatellites = (
    {
        "type" : "spaceAndEarthScience",
        "url" : "http://celestrak.com/NORAD/elements/gp.php?GROUP=science&FORMAT=tle"
    },
    {
        "type" : "geodetic",
        "url"   : "http://celestrak.com/NORAD/elements/gp.php?GROUP=geodetic&FORMAT=tle"
    },
    {
        "type" : "engineering",
        "url" : "http://celestrak.com/NORAD/elements/gp.php?GROUP=engineering&FORMAT=tle"
    },
    {
        "type" : "education",
        "url" : "http://celestrak.com/NORAD/elements/gp.php?GROUP=education&FORMAT=tle"
    }
)

starLink = ({
    "type" : "starLink",
    "url" : "https://celestrak.com/NORAD/elements/supplemental/starlink.txt"
},
)

satellitesTLE = (specialInterestSatellites , WeatherAndEarthResourcesSat , scientificSatellites , starLink)


for category in satellitesTLE : 

    for data in category:  
        
        file = urllib.request.urlopen(data["url"]) #get text from online url
        print("getting " + data["type"]+" from " +data["url"] ) #to verify the request done secussfully 
        textFile = open("C:\\Users\pc\Desktop\my projects\Satellite-tracker\jsonFiles\\tle.txt","a") #local file to store the data we got from the url 

        for line in file : 
            #here we will decode the txt file from the web and write it into our text file 
            decoded_line = line.decode("utf-8")  
            textFile.write(decoded_line.strip()+"\n")

        textFile.close()
        #switch to read-mode to prepare for the convertion
        textFile = open("C:\\Users\pc\Desktop\my projects\Satellite-tracker\jsonFiles\\tle.txt", "r")   
        data2 = textFile.readlines() #each line of the text in separate element
        textFile.close()
        #erase the text file to prepare it for another data from other url
        textFile = open("C:\\Users\pc\Desktop\my projects\Satellite-tracker\jsonFiles\\tle.txt","w")
        textFile.write("")
        textFile.close()

        #convertion algorithm 
        for i in range(0,len(data2)-1, 3) : 

            data2[i] = '  { \n    "name" : "'+data2[i].strip() +'",'+"\n"
            data2[i+1] = '    "tle_line_1" : "'+data2[i+1].strip() +'",'+"\n"
            data2[i+2] = '    "tle_line_2" : "'+data2[i+2].strip() +'" \n  },'+"\n"

        data2.insert(0,"[\n")
        data2[len(data2)-1]=data2[len(data2)-1].replace(",","")
        data2.append("]")    
        
        #if the json file already exists we have to make sure that it's empty 
        jsonFile = open("C:\\Users\pc\Desktop\my projects\Satellite-tracker\jsonFiles\\"+data["type"]+".json","w")
        jsonFile.write("")    
        jsonFile.close()

        #append the data line-by-line from the table to json file
        jsonFile = open("C:\\Users\pc\Desktop\my projects\Satellite-tracker\jsonFiles\\"+data["type"]+".json","a")

        for i in data2 : 
            jsonFile.write(i)
        
        print("Converting " + data["type"]+" to JSON file >>> completed \n"); #to make sure the conversion is completed successfully 
        
        jsonFile.close()

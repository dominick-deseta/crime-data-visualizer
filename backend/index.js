import express from "express"
import mysql from "mysql"
import cors from "cors"
import crypto from 'crypto' 
const app = express()
const db =  mysql.createConnection({
    host:"35.226.134.163",
    user:"root",
    password:"krakys123",
    database:"crime"
})

app.use(express.json())
app.use(cors())

app.get("/", (req,res)=>{
    res.json("Hello this is the backend")
})

app.post("/Crimes", (req,res)=>{
    const lng = req.body.lng;
    const lat = req.body.lat;
    const q = "SELECT * FROM Crimes NATURAL JOIN Location NATURAL JOIN Victims NATURAL JOIN Posts" +
              " WHERE longitude>"+ (lng-1) +" AND longitude<"+ (lng+1) +
              " AND latitude>"+ (lat-1) +" AND latitude<"+ (lat+1) +" LIMIT 30"
    console.log(q)
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post("/callStoredProcedure", (req,res)=>{
    const q ="CALL find_closest_crimes(?, ?)"
    console.log(req.body)
    const values = [req.body.lat, req.body.lng];
    db.query(q, values, (err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.get("/Crimes/AdvQ1", (req,res)=>{
    // FIRST ADVANCED QUERY HERE
    const q = "SELECT v.victimID, v.victim_sex FROM Victims v WHERE v.victim_sex!='' AND v.victimID NOT IN (SELECT c.victimID FROM Crimes c WHERE c.crime_type=110) GROUP BY v.victimID LIMIT 15"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.get("/Crimes/AdvQ2", (req,res)=>{
    // SECOND ADVANCED QUERY HERE
    const q = "SELECT v.victim_sex, c.crime_type, COUNT(*) as count FROM Crimes c JOIN Victims v USING(crimeID) GROUP BY v.victim_sex, c.crime_type HAVING c.crime_type = (SELECT c2.crime_type FROM Crimes c2 JOIN Victims v2 USING(crimeID) WHERE v2.victim_sex = 'F' GROUP BY c2.crime_type ORDER BY COUNT(*) DESC LIMIT 1) ORDER BY COUNT(*) DESC"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.get("/Users", (req,res)=>{
    const q = "SELECT * FROM Users"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.get("/Users/:userName", (req,res)=>{
    const userName = req.params.userName
    const q = "SELECT * FROM Users WHERE userName LIKE '%"+userName+"%'";
    db.query(q, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    });
});

app.post("/Users", (req,res)=>{
    const q = "INSERT INTO Users (`userName`,`password`) VALUES (?)";
    const values = [req.body.userName,
                    req.body.password];
    db.query(q, [values], (err,data)=>{
        if(err) return res.json(err);
        return res.json("User has been created successfully!");
    });
})

function queryAsync(sql, values) {
    return new Promise((resolve, reject) => {
      db.query(sql, values, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

app.post("/AddCrime", (req,res)=>{
    const crimeType = req.body.crimeType
    const crimeLat = req.body.crimeLat
    const crimeLong = req.body.crimeLng
    const crimeDescription = req.body.crimeDescription
    const time = req.body.time
    const victimSex = req.body.victimSex
    const victimRace = req.body.victimRace
    const victimAge = req.body.victimAge
    let crimeID = crypto.randomUUID()
    let locationID = crypto.randomUUID()
    let victimID = crypto.randomUUID()
    let postID = crypto.randomUUID()
    const username = req.body.username
    console.log(req.body)
    const q_crime = "INSERT INTO Crimes (`crimeID`, `locationID`, `crime_type`, `time`, `user_report`, `victimID`) VALUES (?)";
    const q_location = "INSERT INTO Location (`locationID`, `crimeID`, `areaCode`, `areaName`, `districtNum`, `premiseDesc`, `address`, `crossStreet`, `latitude`, `longitude`) VALUES (?)"
    const q_victim = "INSERT INTO Victims (`victimID`, `crimeID`, `victim_age`, `victim_sex`, `victim_race`) VALUES (?)"
    const q_posts = "INSERT INTO Posts (`postid`,`userName`,`crimeID`, `upvotes`,`downvotes`, `description`) VALUES (?)"
    const values_location = [locationID, crimeID, 0, 0, 0, "", "", "", crimeLat, crimeLong];
    const values_victim = [victimID, crimeID, victimAge, victimSex, victimRace]
    const values_crime = [crimeID, locationID, crimeType, time, 1, victimID]
    const values_posts = [postID, username, crimeID, 0, 0, crimeDescription]
    db.query(q_crime, [values_crime], (err,data)=>{
        if(err) console.log(err);
    });
    db.query(q_location, [values_location], (err,data)=>{
        if(err) console.log(err);
    });
    db.query(q_victim, [values_victim], (err,data)=>{
        if(err) console.log(err);
    });
    db.query(q_posts, [values_posts], (err,data)=>{
        if(err) console.log(err);
    });
    
    // db.query(q_location, [values_location], (err,data)=>{
    //     if(err) return res.json(err);
    //     return res.json("Location has been created successfully!");
    // });
    // return res.json(values_crime);
//   try {
//     // Execute queries sequentially
//     await queryAsync(q_crime, [values_crime]);
//     console.log("Crime Inserted Correctly");

//     await queryAsync(q_location, [values_location]);
//     console.log("Location Inserted Correctly");

//     await queryAsync(q_victim, [values_victim]);
//     console.log("Victim Inserted Correctly");

//     await queryAsync(q_posts, [valus_posts]);
//     console.log("Post Inserted Correctly");

//     // Send the response only once, after all queries have been executed
//     res.status(200).json({ message: "All data inserted correctly" });
//   } catch (err) {
//     // Handle the error and send the response
//     res.status(500).json(err);
//   }
})
app.post("/SignIn", (req,res)=>{
    const userName = req.body.userName
    const password = req.body.password

    const q = "SELECT COUNT(*) as count FROM Users WHERE userName='"+userName+"' AND password='"+password+"'";
    db.query(q, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    });
})

app.delete("/deleteCrime/:crimeID", (req,res)=>{
    const crimeID = req.params.crimeID;
    const q = "DELETE FROM Crimes WHERE crimeID = ?";
    db.query(q, [crimeID], (err,data)=>{
        if(err) return res.json(err);
        return res.json("Crime has been deleted successfully!");
    });
});

app.put("/updateCrime/:crimeID", (req,res)=>{
    const crimeID = req.params.crimeID;
    const q = "UPDATE Crimes SET `crimeID`=?,`crimeID`=? WHERE crimeID=?";
    const values = [req.body.userName,
                    req.body.password];
    db.query(q, [...values,userName], (err,data)=>{
        if(err) return res.json(err);
        return res.json("User has been updated successfully!");
    });
});

app.delete("/Users/:userName", (req,res)=>{
    const userName = req.params.userName;
    const q = "DELETE FROM Users WHERE userName = ?";
    db.query(q, [userName], (err,data)=>{
        if(err) return res.json(err);
        return res.json("User has been deleted successfully!");
    });
});

app.put("/Users/:userName", (req,res)=>{
    const userName = req.params.userName;
    const q = "UPDATE Users SET `userName`=?,`password`=? WHERE userName=?";
    const values = [req.body.userName,
                    req.body.password];
    db.query(q, [...values,userName], (err,data)=>{
        if(err) return res.json(err);
        return res.json("User has been updated successfully!");
    });
});

app.listen(3306, ()=>{
    console.log("Connected to backend!")
});
const pool = require('../config/dbConnection')

const addUserType = (req, res) => {
  const reqBody = req.body;
  const { UserTypeName } = reqBody;

  if (!UserTypeName) {
    return res.status(400).send({ status: 400, Message: "UserTypeName field is required." });
  }

  const selectQuery = 'SELECT * FROM `user_type` WHERE `UserTypeName` = ?';
  pool.query(selectQuery, UserTypeName, (selectErr, selectResults, selectFields) => {
    if (selectErr) {
      return res.status(500).send({status:400, Message:'Internal Server Error.'})
    }
    if (selectResults.length > 0) {
      return res.status(400).send({status:400, Message:'UserTypeName is already exists.'})
    }
    const insertQuery = 'INSERT INTO `user_type` (`UserTypeName`) VALUES (?)';
    pool.query(insertQuery, UserTypeName, (err, result, fields) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).send({ error: 'Internal Server Error' });
      }
      // Query the maximum PermissionModuleID from the modules table
      const newGeneratedUserTypeID = result.insertId
      const maxModuleIDQuery = 'SELECT MAX(PermissionModuleID) AS maxModuleID FROM modules';
      pool.query(maxModuleIDQuery, (maxIDErr, maxIDResults, maxIDFields) => {
        if (maxIDErr) {
          console.error('Error retrieving max PermissionModuleID:', maxIDErr);
          return res.status(500).send({ status: 500, error: 'Internal Server Error' });
        }

        const maxModuleID = maxIDResults[0].maxModuleID || 0;
        let startingPermissionModuleID = maxModuleID + 1;

        const defaultModulePermissionInsertQuery = 'INSERT INTO modules (PermissionModuleID,PermissionModuleName,PermissionModuleKey,PermissionModuleAdd,PermissionModuleEdit,PermissionModuleDelete,PermissionModuleView,UserTypeID) VALUES ?'
        const defaultModulePermissionValues = [
          [startingPermissionModuleID++, 'Risk Dashboard', 'RiskDashboard', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Map View', 'MapView', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Point Of Interests', 'POI', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'My Incidents', 'MyIncidents', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Area Of Interests', 'AOI', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Incident Analysis', 'IncidentAnalysis', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Project View', 'ProjectView', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Project Context View', 'ProjectContextView', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Project Risk Framework View', 'ProjectRiskFrameworkView', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Project Threat Assessment', 'ProjectThreatAssessment', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Project Assets', 'ProjectAssets', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Project Target Attractiveness', 'ProjectTargetAttractiveness', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Project Risk Analysis', 'ProjectRiskAnalysis', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Project Control Audit', 'ProjectControlAudit', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Project Monitor Review', 'ProjectMonitorReview', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Project Image Library', 'ProjectImageLibrary', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Project Reports', 'ProjectReports', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Threat Library', 'ThreatLibrary', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Asset Library', 'AssetLibrary', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Control Library', 'ControlLibrary', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Image Library', 'ImageLibrary', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'SRA Project Type', 'SRAProjectType', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Symbol Library', 'SymbolLibrary', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'User Management', 'UserManagement', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Context Headers', 'ContextHeaders', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Organization Management', 'OrganizationManagement', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'User Access Report', 'UserAccessReport', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'User Training Access Report', 'UserTrainingAccessReport', 0, 0, 0, 0, newGeneratedUserTypeID],
          [startingPermissionModuleID++, 'Project Usage Report', 'ProjectUsageReport', 0, 0, 0, 0, newGeneratedUserTypeID],
        ];
        pool.query(defaultModulePermissionInsertQuery, [defaultModulePermissionValues], (insertErr, insertResults, insertFields) => {
          if (insertErr) {
            console.error('Error inserting default module permissions:', insertErr);
            return res.status(500).send({ status: 500, error: 'Internal Server Error' });
          }
          if (insertResults) {
            return res.status(200).send({ data:  {
              UserTypeName: reqBody.UserTypeName,
              UserTypeID: newGeneratedUserTypeID
            }, status: 200, Message: "User Type is created successfully." });
          }
        })
      })
    });
  })
};

const getUserType = (req, res) => {
  const selectQuery = 'SELECT `UserTypeName`, `UserTypeID` FROM `user_type`';
  pool.query(selectQuery, (err,results,fields) => {
    if (err) {
      return res.status(500).send({ error: 'Internal Server Error' });
    }
    return res.status(200).json({ data: results, status: 200 });
  })
}

const getUserTypeModulesPermission = (req, res) => {
  const UserTypeID = req.params.id
  const selectUserTypeQuery = 'SELECT * FROM `user_type` WHERE UserTypeID = ?';
  pool.query(selectUserTypeQuery, UserTypeID, (userTypeErr,userTypeResults,fields) => {
    if (userTypeErr) {
      return res.status(500).send({ status: 500, error: 'Internal Server Error' });
    }
    if (userTypeResults.length === 0) {
      return res.status(404).send({status:404, error:'UserTypeID not found'})
    }
    const userTypeData = userTypeResults[0]
    // const selectQuery = `
    //   SELECT 
    //     u.UserTypeName,
    //     u.UserTypeID,
    //     m.PermissionModuleID,
    //     m.PermissionModuleName,
    //     m.PermissionModuleKey,
    //     m.PermissionModuleAdd,
    //     m.PermissionModuleEdit,
    //     m.PermissionModuleDelete,
    //     m.PermissionModuleView
    //   FROM 
    //     user_type u
    //   LEFT JOIN 
    //     modules m ON u.UserTypeID = m.UserTypeID
    //   WHERE 
    //     u.UserTypeID = ?;
    // `;
    const selectQuery = 'SELECT `PermissionModuleID`, `PermissionModuleName`, `PermissionModuleKey`,`PermissionModuleAdd`,`PermissionModuleEdit`,`PermissionModuleDelete`,`PermissionModuleView` FROM `modules` WHERE UserTypeID = ?';
    pool.query(selectQuery, UserTypeID, (err,results,fields) => {
      if (err) {
        return res.status(500).send({ error: 'Internal Server Error' });
      }
      const resultData = {
        UserTypeID: userTypeData.UserTypeID,
        UserTypeName: userTypeData.UserTypeName,
        ModulesPermission:results
      }
      // console.log('resultData :', resultData);
      return res.status(200).json({ data: resultData, status: 200 });
    })
  })
}

// const updateUserTypeModulesPermission = ((req, res) => {
//   const reqBody = req.body
//   const UserTypeID = req.params.id
//   const {UserTypeName,UserTypePermissionView} = reqBody
//   if (!reqBody) {
//     return res.status(400).send({ status: 400, error: "All field are required." });
//   }
//   if (!UserTypeName) {
//     return res.status(400).send({ status: 400, error: "UserTypeName field is required." });
//   }
//   const updateUserTypeQuery = 'UPDATE `user_type` SET UserTypeName = ? WHERE UserTypeID = ?'
//   const updateUserTypeValues = [UserTypeID, UserTypeName]
//   pool.query(updateUserTypeQuery, updateUserTypeValues, (updateUserTypeErr, updateUserTypeResult) => {

//     if (updateUserTypeErr) {
//       console.error('Error updating user type:', updateUserTypeErr);
//       return res.status(500).send({ status: 500, error: 'Internal Server Error' });
//     }
//     if (UserTypePermissionView && UserTypePermissionView.length > 0) {
//       console.log('UserTypePermissionView :', UserTypePermissionView);
//       const udpateModulePermissionQueries = UserTypePermissionView.map((permission) => {
//         const { PermissionModuleID, PermissionModuleName, PermissionModuleKey, PermissionModuleAdd, PermissionModuleEdit, PermissionModuleDelete, PermissionModuleView } = permission
//         return ['UPDATE modules SET PermissionModuleName = ?, PermissionModuleKey = ?, PermissionModuleAdd = ?, PermissionModuleEdit = ?, PermissionModuleDelete = ?, PermissionModuleView = ? WHERE UserTypeID = ? AND PermissionModuleID = ? ',
//           [PermissionModuleName, PermissionModuleKey, PermissionModuleAdd, PermissionModuleEdit, PermissionModuleDelete, PermissionModuleView, UserTypeID, PermissionModuleID]]
//       })
//       console.log('udpateModulePermissionQueries :', udpateModulePermissionQueries);
//       udpateModulePermissionQueries.forEach(([query,values]) => {
//         pool.query(query, values, (updateModuleErr, updateModuleResult) => {
//           if (updateModuleErr) {
//             return res.status(500).send({ status: 500, error: 'Internal Server Error' });
//           }
//         })
//       });
//       return res.status(200).send({ status: 200, message: 'User type and module permissions updated successfully' });
//     }
//   })
// })

const updateUserTypeModulesPermission = (req, res) => {
  const reqBody = req.body;
  const UserTypeID = req.params.id;
  const { UserTypeName, UserTypePermissionView } = reqBody;

  if (!reqBody || !UserTypeName) {
    return res.status(400).send({ status: 400, error: "All fields are required." });
  }

  const updateUserTypeQuery = 'UPDATE `user_type` SET UserTypeName = ? WHERE UserTypeID = ?';
  const updateUserTypeValues = [UserTypeName, UserTypeID];

  pool.query(updateUserTypeQuery, updateUserTypeValues, (updateUserTypeErr, updateUserTypeResult) => {
    if (updateUserTypeErr) {
      console.error('Error updating user type:', updateUserTypeErr);
      return res.status(500).send({ status: 500, error: 'Internal Server Error' });
    }

    if (UserTypePermissionView && UserTypePermissionView.length > 0) {
      const updateModulePermissionQueries = UserTypePermissionView.map(permission => {
        const { PermissionModuleID, PermissionModuleName, PermissionModuleKey, PermissionModuleAdd, PermissionModuleEdit, PermissionModuleDelete, PermissionModuleView } = permission;
        const updateModuleQuery = 'UPDATE modules SET PermissionModuleName = ?, PermissionModuleKey = ?, PermissionModuleAdd = ?, PermissionModuleEdit = ?, PermissionModuleDelete = ?, PermissionModuleView = ? WHERE UserTypeID = ? AND PermissionModuleID = ?';
        const updateModuleValues = [PermissionModuleName, PermissionModuleKey, PermissionModuleAdd, PermissionModuleEdit, PermissionModuleDelete, PermissionModuleView, UserTypeID, PermissionModuleID];
        return [updateModuleQuery, updateModuleValues];
      });

      updateModulePermissionQueries.forEach(([query, values]) => {
        pool.query(query, values, (updateModuleErr, updateModuleResult) => {
          if (updateModuleErr) {
            console.error('Error updating module:', updateModuleErr);
            return res.status(500).send({ status: 500, error: 'Internal Server Error' });
          }
        });
      });

      return res.status(200).send({ status: 200, message: 'User type and module permissions updated successfully' });
    }
  });
};


module.exports = {addUserType, getUserType, getUserTypeModulesPermission, updateUserTypeModulesPermission}
import { ObjectId } from "bson";

// class cases{
//   constructor({

//     _partition,
//     id = new ObjectId(),
//   }) {
//     this._partition = _partition;
//     this._id = id;
//     this.caseName = caseName;
//     this.surgeonId=surgeonId;
//   }
//    static CasesSchema = {
//     name: 'Cases',
//     properties: {
//       _id: 'objectId',
//       _partition: 'string',
//       patientName: 'string',
//       surgeonId: 'User',
//     },
//     primaryKey: '_id',
//   };
// }

class Hospital{
  constructor({
    _id,
    _partition,
    city,
    hospitalName
  }) {
    this._id = _id;
    this._partition = _partition;
    this.city = city;
    this.hospitalName=hospitalName;
  }
  static HospitalSchema = {
    name: 'Hospital',
    properties: {
      _id: 'objectId',
      _partition: 'string',
      city: 'string',
      hospitalName: 'string',
    },
    primaryKey: '_id',
  };
}

class User{
  constructor({
    _id = new ObjectId(),
    _partition,
    hospital,
    name,
    role
  }) {
    this._id = _id;
    this._partition = _partition;
    this.hospital = hospital;
    this.name=name;
    this.role=role
  }
  UserSchema = {
    name: 'User',
    properties: {
      _id: 'objectId',
      _partition: 'string',
      hospital: 'objectId?',
      name: 'string',
      role: 'string?',
      owner: "UserRole?"
    },
    primaryKey: '_id',
  };
}

export { Hospital, User};

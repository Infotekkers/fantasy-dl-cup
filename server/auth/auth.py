# Importing
from flask import Blueprint,request,json
from flask.globals import current_app

# Importing DB Instance
from main import db

# OS For path handling
import os

# Importing DB Models
from models.users import Users

# Importing Restx Api
from flask_restx import Resource, Api

# Import JWT
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

# Import Firebase admin SDK
import firebase_admin
from firebase_admin import auth 
from firebase_admin import credentials

# Creating a Blueprint
auth_app = Blueprint("auth",__name__)

# Creating API Instance
auth_route= Api(auth_app)

# Initialize Admin SDK
dirname = os.path.dirname(__file__)
filename = os.path.join(dirname,"../serviceCredentials.json")
cred = credentials.Certificate(filename)
default_app = firebase_admin.initialize_app(cred)


#Route to add user to database
@auth_route.route("/signuser")
class Register(Resource):
    def post(self):
        try:
            response_object = {'status':'success'}
            post_data = request.get_json()['user_info']
            lname = " "
            firebase_id =post_data['firebase_id']
            fname=post_data['fname']
            team_name=post_data['team_name']
            if(post_data['lname']):
                lname = post_data['lname']
            new_user = Users(firebase_id=firebase_id,fname=fname,lname=lname,teamname=team_name);
            db.session.add(new_user)
            db.session.commit()                
            return (response_object) , 200
        except:
            return ({}) 
   
# Route to get User ID
@auth_route.route("/getUserID/<firebase_id>")
class UserId(Resource):
    def post(self,firebase_id):
        user = Users.query.filter_by(firebase_id=firebase_id).first()
        if(user):
            access_token = create_access_token(identity=user.id)
            response_object = {
                "code": "Success",
                "id": user.id,
                "token":access_token,
                "team_name": user.teamname
            }
            return (response_object)
        response_object = {"code":"Error"}
        return (response_object)
   
   
# Route to Check User Firebase ID
@auth_route.route("/getuser/<firebase_id>")
class User(Resource):
    def get(self,firebase_id):
        user = Users.query.filter_by(firebase_id=firebase_id).first()
        if(user):
            response_object = {
                "code": "Error",
                "message": "firebase_id already in database"
            }
            return(response_object)
        response_object = {"code":"Success"}
        return (response_object)


@auth_route.route("/profile/<user_id>")
class Profile(Resource):
    @jwt_required()
    def get(self,user_id):
        current_user = Users.query.filter_by(id=user_id).first()
        if current_user:
            return {"id":user_id,"fname":current_user.fname,"lname":current_user.lname,"teamname":current_user.teamname} , 200
        else:
            return {"message":"User Not Found"} , 404
    @jwt_required()
    def patch(self,user_id):
        new_info = request.get_json()['new_info']
        current_user = Users.query.filter_by(id=user_id).first()
        current_user.fname = new_info['fname']
        current_user.lname = new_info['lname']
        current_user.teamname = new_info['teamname']
        db.session.commit()
 
# Route to get firebase ID by user_id       
@auth_route.route("/profile/firebaseID/<user_id>")
class UserInfo(Resource):
    @jwt_required()
    def get(self,user_id):
        user = Users.query.filter_by(id=user_id).first()
        if(user):
            return {"firebase_id":user.firebase_id} , 200
        else:
            return {"message":"User Not Found"} , 404
        
@auth_route.route("/profile/email/<firebase_id>")
class Email(Resource):
    @jwt_required()
    def get(self,firebase_id):
        uid = firebase_id
        user = auth.get_user(uid)
        return {"email":user.email}
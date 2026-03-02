import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  // User System State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Content Types
  type Notice = {
    id : Nat;
    title : Text;
    content : Text;
    date : Time.Time;
  };

  type StudyMaterial = {
    id : Nat;
    title : Text;
    description : Text;
    subject : Text;
    file : Storage.ExternalBlob;
  };

  type Photo = {
    id : Nat;
    title : Text;
    image : Storage.ExternalBlob;
  };

  var nextNoticeId = 0;
  var nextMaterialId = 0;
  var nextPhotoId = 0;

  let notices = Map.empty<Nat, Notice>();
  let studyMaterials = Map.empty<Nat, StudyMaterial>();
  let photos = Map.empty<Nat, Photo>();

  // Notices
  public shared ({ caller }) func createNotice(title : Text, content : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can create notices");
    };
    let notice : Notice = {
      id = nextNoticeId;
      title;
      content;
      date = Time.now();
    };
    notices.add(nextNoticeId, notice);
    nextNoticeId += 1;
  };

  public shared ({ caller }) func deleteNotice(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can delete notices");
    };
    if (not (notices.containsKey(id))) {
      Runtime.trap("Notice not found");
    };
    notices.remove(id);
  };

  public query ({ caller }) func getNotice(id : Nat) : async ?Notice {
    notices.get(id);
  };

  public query ({ caller }) func getAllNotices() : async [Notice] {
    let list = List.empty<Notice>();
    for ((_, notice) in notices.entries()) {
      list.add(notice);
    };
    list.toArray();
  };

  // Study Materials
  public shared ({ caller }) func uploadStudyMaterial(title : Text, description : Text, subject : Text, file : Storage.ExternalBlob) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can upload study materials");
    };
    let material : StudyMaterial = {
      id = nextMaterialId;
      title;
      description;
      subject;
      file;
    };
    studyMaterials.add(nextMaterialId, material);
    nextMaterialId += 1;
  };

  public shared ({ caller }) func deleteStudyMaterial(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can delete study materials");
    };
    if (not (studyMaterials.containsKey(id))) {
      Runtime.trap("Study material not found");
    };
    studyMaterials.remove(id);
  };

  public query ({ caller }) func getStudyMaterial(id : Nat) : async ?StudyMaterial {
    studyMaterials.get(id);
  };

  public query ({ caller }) func getAllStudyMaterials() : async [StudyMaterial] {
    let list = List.empty<StudyMaterial>();
    for ((_, material) in studyMaterials.entries()) {
      list.add(material);
    };
    list.toArray();
  };

  // Photos
  public shared ({ caller }) func uploadPhoto(title : Text, image : Storage.ExternalBlob) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can upload photos");
    };
    let photo : Photo = {
      id = nextPhotoId;
      title;
      image;
    };
    photos.add(nextPhotoId, photo);
    nextPhotoId += 1;
  };

  public shared ({ caller }) func deletePhoto(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can delete photos");
    };
    if (not (photos.containsKey(id))) {
      Runtime.trap("Photo not found");
    };
    photos.remove(id);
  };

  public query ({ caller }) func getPhoto(id : Nat) : async ?Photo {
    photos.get(id);
  };

  public query ({ caller }) func getAllPhotos() : async [Photo] {
    let list = List.empty<Photo>();
    for ((_, photo) in photos.entries()) {
      list.add(photo);
    };
    list.toArray();
  };
};

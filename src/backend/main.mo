import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  // User System State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Profiles Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
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

  // Notice
  type Notice = {
    id : Nat;
    title : Text;
    content : Text;
    date : Time.Time;
  };

  let notices = Map.empty<Nat, Notice>();
  var nextNoticeId = 0;

  public shared ({ caller }) func createNotice(title : Text, content : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create notices");
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
      Runtime.trap("Unauthorized: Only admins can delete notices");
    };
    if (not (notices.containsKey(id))) {
      Runtime.trap("Notice not found");
    };
    notices.remove(id);
  };

  public query func getNotice(id : Nat) : async ?Notice {
    notices.get(id);
  };

  public query func getAllNotices() : async [Notice] {
    let noticesArray = List.empty<Notice>();
    for ((_, notice) in notices.entries()) {
      noticesArray.add(notice);
    };
    noticesArray.toArray();
  };

  // StudyMaterial
  type StudyMaterial = {
    id : Nat;
    title : Text;
    description : Text;
    subject : Text;
    file : Storage.ExternalBlob;
  };

  let studyMaterials = Map.empty<Nat, StudyMaterial>();
  var nextMaterialId = 0;

  public shared ({ caller }) func uploadStudyMaterial(title : Text, description : Text, subject : Text, file : Storage.ExternalBlob) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can upload study materials");
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
      Runtime.trap("Unauthorized: Only admins can delete study materials");
    };
    if (not (studyMaterials.containsKey(id))) {
      Runtime.trap("Study material not found");
    };
    studyMaterials.remove(id);
  };

  public query func getStudyMaterial(id : Nat) : async ?StudyMaterial {
    studyMaterials.get(id);
  };

  public query func getAllStudyMaterials() : async [StudyMaterial] {
    let materialsArray = List.empty<StudyMaterial>();
    for ((_, material) in studyMaterials.entries()) {
      materialsArray.add(material);
    };
    materialsArray.toArray();
  };

  // Photo
  type Photo = {
    id : Nat;
    title : Text;
    image : Storage.ExternalBlob;
  };

  let photos = Map.empty<Nat, Photo>();
  var nextPhotoId = 0;

  public shared ({ caller }) func uploadPhoto(title : Text, image : Storage.ExternalBlob) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can upload photos");
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
      Runtime.trap("Unauthorized: Only admins can delete photos");
    };
    if (not (photos.containsKey(id))) {
      Runtime.trap("Photo not found");
    };
    photos.remove(id);
  };

  public query func getPhoto(id : Nat) : async ?Photo {
    photos.get(id);
  };

  public query func getAllPhotos() : async [Photo] {
    let photosArray = List.empty<Photo>();
    for ((_, photo) in photos.entries()) {
      photosArray.add(photo);
    };
    photosArray.toArray();
  };

  // Visitor Counter
  var visitorCount : Nat = 0;

  public shared func recordVisit() : async () {
    visitorCount += 1;
  };

  public query func getVisitorCount() : async Nat {
    visitorCount;
  };

  // Visitor Sign-In
  type VisitorEntry = {
    id : Nat;
    name : Text;
    institution : Text;
    visitedAt : Time.Time;
  };

  let visitorEntries = Map.empty<Nat, VisitorEntry>();
  var nextVisitorId = 0;

  public shared func signInVisitor(name : Text, institution : Text) : async VisitorEntry {
    let entry : VisitorEntry = {
      id = nextVisitorId;
      name;
      institution;
      visitedAt = Time.now();
    };
    visitorEntries.add(nextVisitorId, entry);
    nextVisitorId += 1;
    visitorCount += 1;
    entry;
  };

  public query func getAllVisitors() : async [VisitorEntry] {
    let visitorsArray = List.empty<VisitorEntry>();
    for ((_, entry) in visitorEntries.entries()) {
      visitorsArray.add(entry);
    };
    visitorsArray.toArray();
  };
};

package moadong.global.util;

import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.bson.types.ObjectId;

public class ObjectIdConverter {
    public static ObjectId convertString(String id){
        ObjectId objectId;
        try{
            objectId = new ObjectId(id);
        } catch (IllegalArgumentException e){
            throw new RestApiException(ErrorCode.CLUB_ID_INVALID);
        }
        return objectId;
    }
}

const BATCH_LIMIT = 500;

type FIRESTORE_DOCUMENTS_TYPE = any[];

function useBatch(firestoreDocuments: FIRESTORE_DOCUMENTS_TYPE): any[] {
  var BATCH_DATA: FIRESTORE_DOCUMENTS_TYPE = [];

  const ARRAY_LENGTH: number = firestoreDocuments.length;
  const BATCH_TIMES: number = Math.floor(ARRAY_LENGTH / BATCH_LIMIT);
  const BATCH_LAST: number = ARRAY_LENGTH - BATCH_TIMES * BATCH_LIMIT;

  if (BATCH_TIMES == 0) {
    BATCH_DATA.push(firestoreDocuments.slice(0, BATCH_LAST));
  } else {
    for (let i = 0; i < BATCH_TIMES; i++) {
      if (i == 0) {
        BATCH_DATA.push(firestoreDocuments.slice(0, BATCH_LIMIT));
      } else {
        BATCH_DATA.push(
          firestoreDocuments.slice(BATCH_LIMIT * i, BATCH_LIMIT * (i + 1))
        );
      }
      if (
        BATCH_TIMES == i + 1 &&
        firestoreDocuments.slice(BATCH_LIMIT * (i + 1), ARRAY_LENGTH).length > 0
      ) {
        BATCH_DATA.push(
          firestoreDocuments.slice(BATCH_LIMIT * (i + 1), ARRAY_LENGTH)
        );
      }
    }
  }

  return BATCH_DATA;
}

export { useBatch };

class Node {
    constructor(data) {
        this.value = data;
        this.next = null;
    };
}


class Linklist {

    constructor() {
        this.head = null;
    }

    append(data) {

        const newList = new Node(data);

        if(this.head === null) {
            this.head = newList;                    
            return;
        }

        let current = this.head;

        while(current.next !== null) {
            current = current.next;
        }

        current.next = newList;
    }
}



class HashMap {

    setBuckets(capacity = 16) {
        return new Array(capacity);
    }

    #bucketsValues = 0;
    
    constructor() {
        this.loadFactor = 0.75;
        this.capacity = 16;

        this.buckets = this.setBuckets();
    }

    hash(key) {

        let hashCode = 0
        const primeNumber = 31;

        for(let i = 0; i < key.length; i++) {

            hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
        }

        return hashCode;
    }

    rehash() {

        const newBuckets = this.setBuckets(this.setBuckets(this.capacity));

        for(let i = 0; i < this.buckets.length; i++) {

            if(!this.buckets[i]) {
                continue;
            }

            
            let list = this.buckets[i];
            let current = list.head;

            while(current) {

                const data = Object.entries(current.value).flat()

                let newBucketKey = this.hash(data[0]);

                if(newBuckets[newBucketKey] !== undefined) {

                    const linkList = newBuckets[newBucketKey];
                    linkList.append({[data[0]]: data[1]});

                } else {

                    const linkList = new Linklist();
                    linkList.append({[data[0]]: data[1]});

                    newBuckets[newBucketKey] = linkList;
                }

                current = current.next;
            }
        }

        this.buckets = newBuckets;
    }


    updateValueOfThesameKey(obj, newKey, value) {

        if(typeof obj !== "object") {
           return
        }

        for(const key in obj) {

            if(key === newKey) {
                {obj[key] = value};
                return true
            }
            const found = this.updateValueOfThesameKey(obj[key], newKey, value);

            if(found) {
                return true;
            }
        }

        return false;
    }


    checkBucketThreshold() {

        if((this.#bucketsValues / this.capacity) > this.loadFactor) {
            return true;
        }
        return false;
    }

    set(key, value) {

        if(this.buckets.length === 0) {
            this.buckets = this.setBuckets()
        }

        const BucketKey = this.hash(key); 
        if(BucketKey < 0 || BucketKey > this.buckets.length) {
            throw new RangeError("the key is out of bucket range");
        }

        if(this.buckets[BucketKey] === undefined) {
            const list = new Linklist();
            list.append({[key]: value});
            this.buckets[BucketKey] = list;

            // update bucket counter
            this.#bucketsValues++;
            return;
        }

        const list = this.buckets[BucketKey];
        const found = this.updateValueOfThesameKey(list, key, value);

        if(!found) {
            list.append({[key]: value})
            // update bucket counter
            this.#bucketsValues++;
        }

        // we check if we need to expand our current bucket
        const threshold = this.checkBucketThreshold()
        if(threshold) {
            this.capacity *=2;

            this.rehash();
        }
    }

    get(key) {

        const BucketKey = this.hash(key);

        const bucketToSearch = this.buckets[BucketKey];
        if(!bucketToSearch) {
            return null;
        }

        const list = bucketToSearch;
        let current = list.head;

        while(current) {

            if(current.value[key]) {
                return current.value[key];
            }

            current = current.next;
        }

        return null;
    }

    has(key) {

        let BucketKey = this.hash(key);
        BucketKey = this.buckets[BucketKey];

        if(!BucketKey) {
            return false;
        }

        const list = BucketKey;
        let current = list.head;

        while(current) {
            if(current.value[key]) {
                return true;
            }
            current = current.next
        }

        return false;
    }

    remove(key) {

        let BucketKey = this.hash(key);
        BucketKey = this.buckets[BucketKey];

        if(!BucketKey) {
            return false;
        }

        let list = BucketKey;
        let current = list.head;
        
        if(current.value[key]) {
            list.head = current.next;
            this.#bucketsValues--;

            return true
        }

        while(current.next) {

            if(current.next.value[key]) {
                current.next = current.next.next;
                this.#bucketsValues--;

                return true;
            }

            current = current.next;
        }

        return false;
    }


    length() {

        let counter = 0;

        for(let i = 0; i < this.capacity; i++) {

            if(this.buckets[i] === undefined) {
                continue;
            }

            let list = this.buckets[i].head;
            let current = list;

            while(current) {
                if(current.value) {
                    counter++;
                };

                current = current.next;
            }

        }
        return counter;
    }

    clear() {

        this.buckets.length = 0;
    }

    keys() {

        let arrOfKeys = [];

        for(let i = 0; i < this.capacity; i++) {

            if(this.buckets[i] !== undefined) {

                let current = this.buckets[i].head;

                while(current) {

                    let data = current.value;
                    arrOfKeys.push(Object.keys(data))
                    current = current.next;
                }
            }
        }

        return arrOfKeys.flat();
    }

    values() {

        let arrOfValues = [];

        for(let i = 0; i < this.capacity; i++) {

            if(this.buckets[i] !== undefined) {

                let current = this.buckets[i].head;

                while(current) {

                    let objectValue = current.value;
                    arrOfValues.push(Object.values(objectValue));

                    current = current.next;
                }
            }
        }

        return arrOfValues.flat();
    }

    entries() {

        let arrOfKeyAndValue = [];

        for(let i = 0; i < this.capacity; i++) {

            if(this.buckets[i] !== undefined) {

                let current = this.buckets[i].head;

                while(current) {

                    let object = current.value;

                    if(object) {
                        arrOfKeyAndValue.push(Object.entries(object).flat())
                    }

                    current = current.next;
                }
            }
        }

        return arrOfKeyAndValue;
    }
}


export {HashMap}


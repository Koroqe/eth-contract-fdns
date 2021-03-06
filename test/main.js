var GNS = artifacts.require("GNS");

contract('GNS', function(accounts) {

    it("create, get, remove records", async () => {
        const gns = await GNS.deployed();

        console.log("address",gns.address);

        await gns.createRecord("name",['0x00','0x00','0x00','0x00','0x03','0x31','0x32','0x33']);
        await gns.createRecord("name",['0x00','0x00','0x00','0x00','0x03','0x31','0x2e','0x33']);
        await gns.createRecord("name",['0x00','0x00','0x00','0x00','0x03','0x71','0x42','0x33']);
        await gns.createRecord("name1",['0x00','0x00','0x00','0x00','0x03','0x71','0x42','0x33']);
        await gns.createRecord("name",['0x01','0xff','0xff','0xff','0xaa']);
        await gns.createRecord("name",['0x01','0xff','0xbb','0xff','0xaa']);
        await gns.createRecord("name",['0x02','0xff','0xbb','0xff','0xaa','0xff','0xbb','0xff','0xaa','0xff','0xbb','0xff','0xaa','0xff','0xbb','0xff','0xaa']);
        await gns.createRecord("name",['0x03','0x31','0x32','0x33']);
        await gns.createRecord("name",['0x03','0x31','0x33','0x33']);

        assert.equal(await gns.getRecordsCount("name"), 8, "getRecordsCount wrong result");

        const rawRecordAt = await gns.getRawRecordAt("name",1);
        await gns.removeRecord("name",rawRecordAt);
        assert.equal(await gns.getRecordsCount("name"), 7, "removeRecord not work");

        await gns.createRecord("name",['0x00','0x00','0x00','0x00','0x03','0x37','0x32','0x33']);
        let passed = true;
        try {
            await gns.createRecord("name",['0x00','0x00','0x00','0x00','0x03','0x37','0x32','0x33']);
            passed=false;
        }catch (_) {}
        if(!passed){
            throw "createRecord can create record not unique";
        }

        assert.equal(await gns.getRecordsCount("name1"), 1, "getRecordsCount wrong result");
    });

    it("access test", async () => {
        const gns = await GNS.deployed();

        await gns.createRecord("access0",['0x00','0x00','0x00','0x00','0x03','0x31','0x32','0x33'],{from:accounts[0]});
        await gns.createRecord("access1",['0x00','0x00','0x00','0x00','0x03','0x31','0x32','0x33'],{from:accounts[1]});

        // account1 get count records of account0
        await gns.getRecordsCount("name",{from:accounts[1]});

        {
            let passed = true;
            try {
                await gns.createRecord("access0",['0x00','0x00','0x00','0x00','0x03','0x31','0x32','0x33'],{from:accounts[1]});
                passed=false;
            }catch (_) {}
            if(!passed){
                throw "createRecord not owner have access";
            }
        }

        {
            try {
                await gns.getRawRecordAt("name", 1,{from:accounts[1]});
            }catch (_) {
                throw "getRawRecordAt not owner not have access";
            }
        }
    });

    it("name in register", async () => {
        const gns = await GNS.deployed();

        assert.equal(await gns.isNameExist("name in register"), false, "isNameExist wrong result");

        await gns.createRecord("name in register",['0x00','0x00','0x00','0x00','0x03','0x31','0x32','0x33']);

        assert.equal(await gns.isNameExist("name in register"), true, "isNameExist wrong result");
    });

});
"use strict";
/**
This test checks that needed libraries exist
Now a days I try to avoiding jquery needs
*/
describe('jquery enabled', function () {
    it('should be loaded', function () {
        expect($).toBeDefined();
    })
})

describe('d3 enabled', function () {
    it('should be loaded', function () {
        expect(d3).toBeDefined();
    })
})

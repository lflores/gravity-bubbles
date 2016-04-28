"use strict";
describe('jquery enabled', function() {
    it('should be loaded', function() {
        expect($).toBeDefined();
   })
})
 
describe('d3 enabled', function() {
    it('should be loaded', function() {
        expect(d3).toBeDefined();
    })
})
describe('layer-file-upload-button', function() {
  var el, testRoot;
  beforeEach(function() {
    layerUI.init({layer: layer});
    testRoot = document.createElement('div');
    el = document.createElement('layer-file-upload-button');
    testRoot.appendChild(el);
    document.body.appendChild(testRoot);
  });

  it("Should setup a label pointing to a file input", function() {
    expect(el.nodes.label.getAttribute("for")).toEqual(el.nodes.input.id);
    expect(el.nodes.input.id.length > 0).toBe(true);
  });

  it("Should call layerUI.files.processAttachments onChange", function() {
    var spy = jasmine.createSpy('processAttachments');
    var tmp = layerUI.files.processAttachments;
    layerUI.files.processAttachments = spy;
    el.nodes.input = {
      files: []
    }

    // Run
    el.onChange();

    // Posttest
    expect(spy).toHaveBeenCalledWith([], {width: 300, height: 300}, jasmine.any(Function));

    // Cleanup
    layerUI.files.processAttachments = tmp;
  });

  it("Should trigger layer-file-selected onChange", function() {
    var part = new layer.MessagePart({body: "Frodo is a Dodo", mimeType: "text/plain"});
    var spy = jasmine.createSpy('processAttachments').and.callFake(function(a, b, callback) {
      callback([part]);
    });
    var tmp = layerUI.files.processAttachments;
    layerUI.files.processAttachments = spy;
    el.nodes.input = {
      files: []
    }

    var eventSpy = jasmine.createSpy('eventListener');
    document.body.addEventListener('layer-file-selected', eventSpy);

    // Run
    el.onChange();

    // Posttest
    expect(eventSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      detail: {
        parts: [part]
      }
    }));

    // Cleanup
    layerUI.files.processAttachments = tmp;
  });

  it('Should accept a date parameter', function() {
    var d = new Date();

    it
    el.date = d;
    expect(el.date).toEqual(d);
  });

  it('Should render time only if today', function() {
    var d = new Date();
    el.date = d;
    expect(el.innerHTML).toEqual(d.toLocaleTimeString());
  });

  it('Should render date and time if not today', function() {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    el.date = d;
    expect(el.innerHTML).toEqual(d.toLocaleDateString() + ' ' + d.toLocaleTimeString());
  });

  it('Should rerender to new date', function() {
    var d = new Date();
    el.date = d;

    var d2 = new Date();
    d2.setDate(d.getDate() - 1);
    el.date = d2;
    expect(el.innerHTML).toEqual(d2.toLocaleDateString() + ' ' + d2.toLocaleTimeString());
  });

  it('Should rerender to empty', function() {
    var d = new Date();
    el.date = d;
    el.date = null;
    expect(el.innerHTML).toEqual('');
  });
});
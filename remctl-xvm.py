#!/bin/sh
import remctl
import sys
import os

def run_xvm_command(command):
	command = ('control', 'pistachio', 'create')
	remctl_result = remctl.Remctl()

	# ccache = '/tmp/krb5cc_'+ os.urandom(16).encode('hex')
	ccache = '/tmp/krb5cc_1001'
	print ccache
	remctl_result.set_ccache(ccache)
	print remctl_result
	remctl_open = remctl_result.open(host = 'xvm-remote.mit.edu')
	print remctl_open, 'opened'

	try:
		result = remctl_result.command(command)
		print remctl_result.output()
		
		print 'result', result
	except remctl.RemctlProtocolError, error:
	    print "Error:", str(error)


# print result.stdout
# except remctl.RemctlProtocolError, error:
#     print "Error:", str(error)
#     sys.exit(1)
# if result.stdout:
#     print "stdout:", result.stdout
# if result.stderr:
#     print "stderr:", result.stderr
# print "exit status:", result.status
run_xvm_command('hi')
#!/usr/bin/perl
use strict;
use warnings;

use Data::Dumper;
use File::Basename;
use File::Copy;
use JSON;
use Text::CSV;

my $csv = Text::CSV->new({ binary => 1, auto_diag => 1 });
my $json = JSON->new->allow_nonref->utf8;;

my $benefit = "$ARGV[0]" || '';
if (!$benefit) {
    usage();
    exit;
}
my $source_file = dirname(__FILE__) . '/data/' . $benefit . '.csv';
my $tmp_file = dirname(__FILE__) . '/data/' . $benefit . '.json';
my $dest_file = dirname(__FILE__) . '/../src/data/benefits/' . $benefit . '.json';

# Open the csv file
open(my $source_fh, '<:encoding(utf8)', $source_file)
    or die "Could not open '$source_file' $!\n";

# Read it, building the responses object as we go
my $responses = [];
while (my $fields = $csv->getline($source_fh)) {
    # skip the header
    next if $fields->[0] eq 'Scenario';
    # skip any empty responses
    next if !$fields->[2] || $fields->[2] eq 'N/A';
    # parse the codes field to find conditions
    my $codes = $fields->[1];
    $codes =~ s/'/"/g;
    my $cond = $json->decode($codes);
    # break the response text into paragraphs
    my @paras = split /[\n\r]+/, $fields->[2];
    # build the response spec
    push @$responses, {
        conditions => $cond,
        text => [ @paras ],
    };
}
if (not $csv->eof) {
  $csv->error_diag();
}

# Close it
close $source_fh;

# Write the json to a temp file here (clobber whatever's there, we don't care)
open(my $tmp_fh, '>:encoding(utf8)', $tmp_file)
    or die "Could not open '$tmp_file' $!\n";
print $tmp_fh $json->encode($responses);
close $tmp_fh;

# If all is well, move it into the data directory so it can be committed
move($tmp_file, $dest_file)
    or die "Could not move to '$dest_file': $!";
print "Done!\n";

sub usage {
    print "import_benefits.pl <benefit>\n";
    print "\n";
    print "  <benefit> can be one of: 'ffcra', 'nys', 'dwbor', or 'cares'\n";
}


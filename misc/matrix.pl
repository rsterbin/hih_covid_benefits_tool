#!/usr/bin/perl

use Clone 'clone';
use Data::Dumper;
use JSON;

my $JSON = JSON->new->allow_nonref->utf8;;

my $list = "$ARGV[0]" || '';
my $view = "$ARGV[1]" || '';

my $options;
if ($list eq 'ffcra') {
    $options = get_ffcra_options();
} elsif ($list eq 'nys') {
    $options = get_nys_options();
} elsif ($list eq 'pssl') {
    $options = get_pssl_options();
} elsif ($list eq 'dwbor') {
    $options = get_dwbor_options();
} elsif ($list eq 'cares') {
    $options = get_cares_options();
} else {
    usage();
    exit;
}

if ($view eq 'options') {
    foreach my $q (@$options) {
        foreach my $a (@{$q->{a}}) {
            print "[$q->{q}] $a->{t}\n";
        }
    }
    print "\n";
} elsif ($view eq 'codes') {
    my $combos = all_combinations($options);
    my $eligibility = [];
    foreach my $scenario (@$combos) {
        my $conditions = {};
        my @pairs = ();
        foreach my $item (@$scenario) {
            $conditions->{$item->{question}} = $item->{answer_code};
            my $a = lc($item->{answer_code});
            push @pairs, "$item->{question}_$a";
        }
        push @$eligibility, {
            conditions => $conditions,
            lang_lookup_key => "results_benefit_$list" . join('_', @pairs),
        };
    }
    print $JSON->encode($eligibility);
} elsif ($view eq 'combos') {
    my $combos = all_combinations($options);
    my $count = 0;
    foreach my $scenario (@$combos) {
        print "\n";
        foreach my $item (@$scenario) {
            next if $item->{answer_code} eq '*';
            print "[$item->{question}] $item->{answer_text}\n";
        }
        ++$count;
    }
    print "\nCombo count: $count\n";
} elsif ($view eq 'csv') {
    my $combos = all_combinations($options);
    foreach my $scenario (@$combos) {
        my @visible = ();
        my @invisible = ();
        foreach my $item (@$scenario) {
            next if $item->{answer_code} eq '*';
            push @visible, "[$item->{question}] $item->{answer_text}";
            push @invisible, "'" . $item->{question} . "':'" . $item->{answer_code} . "'";
        }
        print '"', join('XXX', @visible), '","{', join(',', @invisible), '}",""', "\n"; 
    }
} else {
    usage();
    exit;
}

=pod all_combinations()

Finds all combinations of answers for a given set of questions

@param  arrayref $todo the set of questions and answers to combine
@return arrayref the possible combos, like so:

[
    [
        { question => 'q1', answer_text => 'FIRST RESPONSE', answer_code => 'A' },
        { question => 'q2', answer_text => 'RESPONSE THE FIRST', answer_code => 'A' },
    ]
    [
        { question => 'q1', answer_text => 'FIRST RESPONSE', answer_code => 'A' },
        { question => 'q2', answer_text => 'RESPONSE THE SECOND', answer_code => 'B' },
    ],
    [
        { question => 'q1', answer_text => 'SECOND RESPONSE', answer_code => 'B' },
        { question => 'q2', answer_text => 'RESPONSE THE FIRST', answer_code => 'A' },
    ],
    [
        { question => 'q1', answer_text => 'SECOND RESPONSE', answer_code => 'B' },
        { question => 'q2', answer_text => 'RESPONSE THE SECOND', answer_code => 'B' },
    ],
]

=cut
sub all_combinations {
    my $todo = shift;
    my $question = shift @$todo;
    my $others;
    if (scalar @$todo > 0) {
        $others = all_combinations($todo);
    } else {
        $others = [];
    }
    my @combos = ();
    foreach my $answer (@{$question->{a}}) {
        my $val = { question => $question->{q}, answer_text => $answer->{t}, answer_code => $answer->{c} };
        if (scalar @$others > 0) {
            foreach my $o (@$others) {
                my $combo = clone $o;
                unshift @$combo, $val;
                push @combos, $combo;
            }
        } else {
            push @combos, [ $val ];
        }
    }
    return \@combos;
}

# FFCRA
sub get_ffcra_options {
    return [
        {
            q => 'type',
            a => [
                { t => 'NANNY, HOUSE CLEANER, or HOME ATTENDANT', c => 'N' },
                { t => 'HOME HEALTH CARE WORKER', c => 'E' },
            ],
        },
        {
            q => 'agency',
            a => [
                { t => 'YES', c => 'A' },
                { t => 'NO', c => 'B' },
            ],
        },
        {
            q => 'books',
            a => [
                { t => 'YES (EITHER)', c => 'Y' },
                { t => 'NO', c => 'N' },
            ],
        },
        {
            q => 'reason',
            a => [
                { t => 'SELF-QUARANTINE AND SCHOOL CLOSED', c => 'B' },
                { t => 'SELF-QUARANTINE', c => 'Q' },
                { t => 'SCHOOL CLOSED', c => 'S' },
                { t => 'FAMILY QUARANTINE OR STAY AT HOME', c => 'F' },
                { t => 'NONE', c => 'N' },
            ],
        },
    ];
}

# NYS Sick Days / PFL and DB
sub get_nys_options {
    return [
        {
            q => 'agency',
            a => [
                { t => 'YES', c => 'A' },
                { t => 'NO', c => 'B' },
            ],
        },
        {
            q => 'books',
            a => [
                { t => 'YES, IN COMPLIANCE', c => 'C' },
                { t => 'PARTIALLY OR NO', c => 'N' },
            ],
        },
        {
            q => 'hours per week',
            a => [
                { t => 'UNDER 40', c => 'A' },
                { t => '40 OR MORE', c => 'B' },
            ],
        },
        {
            q => 'reason',
            a => [
                { t => 'SELF-QUARANTINE OR FAMILY QUARANTINE', c => 'Q' },
                { t => 'SCHOOL CLOSED', c => 'S' },
                { t => 'NONE', c => 'N' },
            ],
        },
    ];
}

# NYC PSSL
sub get_pssl_options {
    return [
        {
            q => 'type',
            a => [
                { t => 'NANNY or HOUSE CLEANER', c => 'N' },
                { t => 'HOME ATTENDANT or HOME HEALTH CARE WORKER', c => 'H' },
            ],
        },
        {
            q => 'agency',
            a => [
                { t => 'YES', c => 'A' },
                { t => 'NO', c => 'B' },
            ],
        },
        {
            q => 'employed',
            a => [
                { t => 'LESS THAN ONE YEAR or UNDER 80', c => 'U' },
                { t => 'ONE YEAR OR MORE and OVER 80', c => 'O' },
            ],
        },
    ];
}

# NYS DWBoR
sub get_dwbor_options {
    return [
        {
            q => 'length of employment',
            a => [
                { t => 'LESS THAN ONE YEAR', c => 'U' },
                { t => 'ONE YEAR OR MORE', c => 'O' },
            ],
        },
    ];
}

# CARES UI Benefits
sub get_cares_options {
    return [
        {
            q => 'books',
            a => [
                { t => 'YES, IN COMPLIANCE', c => 'C' },
                { t => 'PARTIALLY or NO', c => 'N' },
            ],
        },
        {
            q => 'length of employment',
            a => [
                { t => 'LESS THAN SIX MONTHS', c => 'A' },
                { t => 'SIX MONTHS OR MORE', c => 'B|C' },
            ],
        },
    ];
}

sub usage {
    print "matrix.pl <list> <view>\n";
    print "\n";
    print "  <list> can be one of: 'ffcra', 'nys', 'pssl', 'dwbor', or 'cares'\n";
    print "  <view> can be one of: 'options', 'codes', 'combos', or 'csv'\n";
}

=pod ALL POSSIBLE ANSWERS

1. [type]
NANNY
HOUSE CLEANER
HOME ATTENDANT
HOME HEALTH CARE WORKER

2. [agency]
YES
NO

3. [books]
YES, IN COMPLIANCE
YES, PARTIALLY
NO

4. [hours per week]
UNDER 40
40 OR MORE

5. [length of employment]
LESS THAN SIX MONTHS
LESS THAN ONE YEAR
ONE YEAR OR MORE

6. [hours per year]
UNDER 80
80 OR MORE

7. [self-quarantine]
YES
NO

8. [family quarantine]
YES
NO

9. [stay at home]
YES
NO

10. [school closed]
YES
NO

=cut

